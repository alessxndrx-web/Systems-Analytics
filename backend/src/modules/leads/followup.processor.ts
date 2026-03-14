import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MessageType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Processor('followups')
export class FollowUpProcessor extends WorkerHost {
  constructor(private prisma: PrismaService, private analytics: AnalyticsService) {
    super();
  }

  async process(job: Job<{ followUpId: string; leadId: string; userId: string }>) {
    const { followUpId, leadId, userId } = job.data;
    const follow = await this.prisma.followUp.findUnique({ where: { id: followUpId }, include: { lead: { include: { business: true } } } });
    if (!follow || follow.lead.status === 'DISCARDED') return;

    await this.prisma.message.create({
      data: {
        leadId,
        userId,
        content: follow.content,
        direction: 'OUTBOUND',
        type: MessageType.FOLLOW_UP,
        approved: true,
        sentAt: new Date()
      }
    });

    await this.prisma.followUp.update({ where: { id: followUpId }, data: { status: 'sent', executedAt: new Date() } });
    await this.analytics.track('MESSAGE_SENT', follow.lead.business.city, follow.lead.business.niche, leadId, 1);
  }
}
