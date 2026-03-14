<<<<<<< ours
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { LeadStatus, MessageType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { LogsService } from '../logs/logs.service';

type FollowUpJobPayload = {
  followUpId: string;
  leadId: string;
  userId: string;
};

@Injectable()
@Processor('followups')
export class FollowUpProcessor extends WorkerHost {
  private readonly logger = new Logger(FollowUpProcessor.name);

  constructor(
    private prisma: PrismaService,
    private analytics: AnalyticsService,
    private logs: LogsService
  ) {
    super();
  }

  async process(job: Job<FollowUpJobPayload>) {
=======
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LeadStatus, MessageType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Processor('followups')
export class FollowUpProcessor extends WorkerHost {
  constructor(private prisma: PrismaService, private analytics: AnalyticsService) {
    super();
  }

  async process(job: Job<{ followUpId: string; leadId: string; userId: string }>) {
>>>>>>> theirs
    const { followUpId, leadId, userId } = job.data;
    const follow = await this.prisma.followUp.findUnique({
      where: { id: followUpId },
      include: { lead: { include: { business: true } } }
    });

<<<<<<< ours
    if (!follow) {
      this.logger.warn(`Follow-up ${followUpId} was not found for job ${job.id}`);
      return;
    }

    if (follow.executedAt || follow.status === 'sent') {
      return;
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        const current = await tx.followUp.findUnique({
          where: { id: followUpId },
          include: { lead: { include: { business: true } } }
        });

        if (!current || current.executedAt || current.status === 'sent') {
          return;
        }

        if (current.lead.status === LeadStatus.DISCARDED) {
          await tx.followUp.update({ where: { id: followUpId }, data: { status: 'cancelled' } });
          await this.logs.create(
            {
              userId,
              leadId,
              action: 'followup.cancelled',
              details: { followUpId }
            },
            tx as Prisma.TransactionClient
          );
          return;
        }

        const executedAt = new Date();

        await tx.message.create({
          data: {
            leadId,
            userId,
            content: current.content,
            direction: 'OUTBOUND',
            type: MessageType.FOLLOW_UP,
            approved: true,
            sentAt: executedAt
          }
        });

        await tx.followUp.update({
          where: { id: followUpId },
          data: { status: 'sent', executedAt }
        });

        await tx.lead.update({
          where: { id: leadId },
          data: { lastContactDate: executedAt, nextFollowUpDate: null }
        });

        await this.analytics.track(
          'MESSAGE_SENT',
          current.lead.business.city,
          current.lead.business.niche,
          leadId,
          1,
          { source: 'followup', messageType: MessageType.FOLLOW_UP },
          tx as Prisma.TransactionClient
        );
        await this.logs.create(
          {
            userId,
            leadId,
            action: 'followup.executed',
            details: { followUpId, scheduledFor: current.scheduledFor.toISOString() }
          },
          tx as Prisma.TransactionClient
        );
      });
    } catch (error) {
      const serialized = this.serializeError(error);
      const attempts = typeof job.opts.attempts === 'number' ? job.opts.attempts : 1;
      const finalAttempt = job.attemptsMade + 1 >= attempts;

      this.logger.error(`Follow-up job ${job.id} failed: ${serialized}`);

      if (finalAttempt) {
        await this.prisma.followUp.updateMany({
          where: { id: followUpId, executedAt: null },
          data: { status: 'failed' }
        });
        await this.logs.create({
          userId,
          leadId,
          action: 'followup.failed',
          details: { followUpId, error: serialized }
        });
      }

      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<FollowUpJobPayload>, error: Error) {
    this.logger.error(`Worker reported a failure for job ${job.id}: ${error.message}`);
  }

  private serializeError(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown worker error';
=======
    if (!follow || follow.lead.status === LeadStatus.DISCARDED || follow.executedAt) return;

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
    await this.prisma.lead.update({ where: { id: leadId }, data: { status: LeadStatus.SENT, lastContactDate: new Date() } });
    await this.prisma.activityLog.create({
      data: {
        userId,
        leadId,
        action: 'FOLLOW_UP_SENT',
        details: { followUpId }
      }
    });
    await this.analytics.track('MESSAGE_SENT', follow.lead.business.city, follow.lead.business.niche, leadId, 1);
>>>>>>> theirs
  }
}
