import { Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async track(eventType: EventType, city?: string, niche?: string, leadId?: string, value?: number) {
    return this.prisma.analyticsEvent.create({ data: { eventType, city, niche, leadId, value } });
  }

  async dashboard() {
    const [byCity, byNiche, sent, replies, meetings, won, revenue] = await Promise.all([
      this.prisma.business.groupBy({ by: ['city'], _count: true }),
      this.prisma.business.groupBy({ by: ['niche'], _count: true }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'MESSAGE_SENT' } }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'REPLY_RECEIVED' } }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'MEETING_SCHEDULED' } }),
      this.prisma.deal.count({ where: { status: 'won' } }),
      this.prisma.deal.aggregate({ _sum: { amount: true }, where: { status: 'won' } })
    ]);

    return {
      prospecting: { byCity, byNiche },
      messaging: { sent, replies, replyRate: sent ? replies / sent : 0 },
      conversion: { meetings, won, conversionRate: meetings ? won / meetings : 0, revenue: revenue._sum.amount ?? 0 }
    };
  }
}
