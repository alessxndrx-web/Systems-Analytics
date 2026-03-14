<<<<<<< ours
import { EventType, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type DbClient = Prisma.TransactionClient | PrismaService;

type AnalyticsEventInput = {
  eventType: EventType;
  city?: string;
  niche?: string;
  leadId?: string;
  value?: number;
  metadata?: Prisma.InputJsonValue;
};

=======
import { Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

>>>>>>> theirs
@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

<<<<<<< ours
  private db(client?: DbClient) {
    return client ?? this.prisma;
  }

  track(eventType: EventType, city?: string, niche?: string, leadId?: string, value?: number, metadata?: Prisma.InputJsonValue, client?: DbClient) {
    return this.db(client).analyticsEvent.create({ data: { eventType, city, niche, leadId, value, metadata } });
  }

  async trackMany(events: AnalyticsEventInput[], client?: DbClient) {
    for (const event of events) {
      await this.track(event.eventType, event.city, event.niche, event.leadId, event.value, event.metadata, client);
    }
  }

  async dashboard() {
    const [byCity, byNiche, sent, replies, meetings, won, revenue] = await Promise.all([
=======
  async track(eventType: EventType, city?: string, niche?: string, leadId?: string, value?: number) {
    return this.prisma.analyticsEvent.create({ data: { eventType, city, niche, leadId, value } });
  }

  async dashboard() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      byCity,
      byNiche,
      sent,
      replies,
      meetings,
      won,
      revenue,
      discoveredToday,
      sentToday,
      repliesToday,
      followupsDue,
      pipeline,
      recentActivity
    ] = await Promise.all([
>>>>>>> theirs
      this.prisma.business.groupBy({ by: ['city'], _count: true }),
      this.prisma.business.groupBy({ by: ['niche'], _count: true }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'MESSAGE_SENT' } }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'REPLY_RECEIVED' } }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'MEETING_SCHEDULED' } }),
      this.prisma.deal.count({ where: { status: 'won' } }),
<<<<<<< ours
      this.prisma.deal.aggregate({ _sum: { amount: true }, where: { status: 'won' } })
    ]);

    return {
=======
      this.prisma.deal.aggregate({ _sum: { amount: true }, where: { status: 'won' } }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'LEAD_DISCOVERED', createdAt: { gte: todayStart } } }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'MESSAGE_SENT', createdAt: { gte: todayStart } } }),
      this.prisma.analyticsEvent.count({ where: { eventType: 'REPLY_RECEIVED', createdAt: { gte: todayStart } } }),
      this.prisma.followUp.count({ where: { executedAt: null, scheduledFor: { lte: new Date() } } }),
      this.prisma.lead.groupBy({ by: ['status'], _count: true }),
      this.prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { lead: { include: { business: true } } }
      })
    ]);

    return {
      today: {
        leadsDiscovered: discoveredToday,
        messagesSent: sentToday,
        repliesReceived: repliesToday,
        followUpsDue: followupsDue
      },
      recentActivity,
      pipeline,
>>>>>>> theirs
      prospecting: { byCity, byNiche },
      messaging: { sent, replies, replyRate: sent ? replies / sent : 0 },
      conversion: { meetings, won, conversionRate: meetings ? won / meetings : 0, revenue: revenue._sum.amount ?? 0 }
    };
  }
}
