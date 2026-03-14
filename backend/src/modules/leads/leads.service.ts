<<<<<<< ours
import { Injectable, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { EventType, LeadStatus, MessageType, Prisma } from '@prisma/client';
import { Queue } from 'bullmq';
import { AiService } from '../ai/ai.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { LogsService } from '../logs/logs.service';
import { PrismaService } from '../prisma/prisma.service';

type FollowUpJobPayload = {
  followUpId: string;
  leadId: string;
  userId: string;
};

const FIRST_MESSAGE_STATUSES = new Set<LeadStatus>([
  LeadStatus.NEW,
  LeadStatus.REVIEWED,
  LeadStatus.QUALIFIED,
  LeadStatus.DRAFT_READY
]);

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

=======
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { EventType, LeadStatus, MessageType } from '@prisma/client';
import { Queue } from 'bullmq';
import { AiService } from '../ai/ai.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsService {
>>>>>>> theirs
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private analytics: AnalyticsService,
<<<<<<< ours
    private logs: LogsService,
    @InjectQueue('followups') private followUpQueue: Queue<FollowUpJobPayload>
=======
    @InjectQueue('followups') private followUpQueue: Queue
>>>>>>> theirs
  ) {}

  list(filters: { niche?: string; status?: LeadStatus; minScore?: number }) {
    return this.prisma.lead.findMany({
      where: {
        status: filters.status,
        score: filters.minScore ? { gte: filters.minScore } : undefined,
        business: filters.niche ? { niche: filters.niche } : undefined
      },
      include: { business: true },
<<<<<<< ours
      orderBy: { score: 'desc' }
=======
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }]
>>>>>>> theirs
    });
  }

  detail(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
<<<<<<< ours
      include: { business: true, messages: true, followUps: true, notes: true, deals: true }
    });
  }

=======
      include: {
        business: true,
        messages: { orderBy: { createdAt: 'desc' } },
        followUps: { orderBy: { scheduledFor: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } },
        deals: { orderBy: { createdAt: 'desc' } },
        activityLog: { orderBy: { createdAt: 'desc' }, take: 50 }
      }
    });
  }


  listDrafts() {
    return this.prisma.message.findMany({
      where: { approved: false, type: MessageType.FIRST_CONTACT },
      include: { lead: { include: { business: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async rejectDraft(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new NotFoundException('Draft not found');

    await this.prisma.message.delete({ where: { id: messageId } });
    await this.prisma.lead.update({ where: { id: message.leadId }, data: { status: LeadStatus.REVIEWED } });
    await this.logActivity(userId, message.leadId, 'MESSAGE_DRAFT_REJECTED', { messageId });
    return { ok: true };
  }

>>>>>>> theirs
  async generateDraft(leadId: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId }, include: { business: true } });
    if (!lead) throw new NotFoundException('Lead not found');
    const content = await this.ai.generateFirstMessage({ leadId, business: lead.business });

<<<<<<< ours
    return this.prisma.message.create({
      data: { leadId, userId, content, direction: 'OUTBOUND', type: MessageType.FIRST_CONTACT, approved: false }
    });
=======
    const message = await this.prisma.message.create({
      data: { leadId, userId, content, direction: 'OUTBOUND', type: MessageType.FIRST_CONTACT, approved: false }
    });

    await this.prisma.lead.update({ where: { id: leadId }, data: { status: LeadStatus.DRAFT_READY } });
    await this.logActivity(userId, leadId, 'MESSAGE_DRAFT_GENERATED', { messageId: message.id });

    return message;
>>>>>>> theirs
  }

  async approveFirstMessage(leadId: string, userId: string, content: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId }, include: { business: true } });
    if (!lead || lead.status === LeadStatus.DISCARDED) throw new NotFoundException('Lead unavailable');
<<<<<<< ours
    if (lead.firstApprovedAt || !FIRST_MESSAGE_STATUSES.has(lead.status)) {
      throw new ConflictException('First message has already been approved for this lead');
    }

    const now = new Date();
    const scheduledFor = this.plusDays(now, 3);
    const followUpContent = await this.ai.generateFollowUp({ lead: lead.business, step: 1 });
    const previousStatus = lead.status;

    const result = await this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          leadId,
          userId,
          content,
          direction: 'OUTBOUND',
          type: MessageType.FIRST_CONTACT,
          approved: true,
          sentAt: now
        }
      });

      await tx.lead.update({
        where: { id: leadId },
        data: {
          status: LeadStatus.SENT,
          firstApprovedAt: now,
          lastContactDate: now,
          nextFollowUpDate: scheduledFor,
          contactedAt: now
        }
      });

      const followUp = await tx.followUp.create({
        data: {
          leadId,
          scheduledFor,
          content: followUpContent,
          status: 'pending_queue'
        }
      });

      await this.analytics.trackMany(
        [
          { eventType: EventType.MESSAGE_SENT, city: lead.business.city, niche: lead.business.niche, leadId, value: 1, metadata: { source: 'approve-first', messageType: MessageType.FIRST_CONTACT } },
          { eventType: EventType.FOLLOW_UP_SCHEDULED, city: lead.business.city, niche: lead.business.niche, leadId, value: 1, metadata: { followUpId: followUp.id, scheduledFor: scheduledFor.toISOString() } },
          { eventType: EventType.LEAD_STATUS_CHANGED, city: lead.business.city, niche: lead.business.niche, leadId, value: 1, metadata: { fromStatus: previousStatus, toStatus: LeadStatus.SENT } }
        ],
        tx as Prisma.TransactionClient
      );

      await this.logs.createMany(
        [
          {
            userId,
            leadId,
            action: 'message.sent',
            details: { messageId: message.id, kind: 'first_contact' }
          },
          {
            userId,
            leadId,
            action: 'followup.scheduled',
            details: { followUpId: followUp.id, scheduledFor: scheduledFor.toISOString() }
          },
          {
            userId,
            leadId,
            action: 'lead.status_changed',
            details: { fromStatus: previousStatus, toStatus: LeadStatus.SENT }
          }
        ],
        tx as Prisma.TransactionClient
      );

      return { message, followUpId: followUp.id };
    });

    const followUpStatus = await this.enqueueFollowUpJob({
      followUpId: result.followUpId,
      leadId,
      userId,
      scheduledFor
    });

    return {
      ...result.message,
      followUpId: result.followUpId,
      followUpStatus
    };
  }

  async updateStatus(id: string, userId: string, status: LeadStatus) {
    const lead = await this.prisma.lead.findUnique({ where: { id }, include: { business: true } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.status === status) {
      return lead;
    }

    const clearsFollowUp = new Set<LeadStatus>([
      LeadStatus.REPLIED,
      LeadStatus.INTERESTED,
      LeadStatus.MEETING,
      LeadStatus.WON,
      LeadStatus.LOST,
      LeadStatus.DISCARDED
    ]).has(status);

    return this.prisma.$transaction(async (tx) => {
      const updatedLead = await tx.lead.update({
        where: { id },
        data: {
          status,
          discardedAt: status === LeadStatus.DISCARDED ? new Date() : null,
          nextFollowUpDate: clearsFollowUp ? null : undefined
        },
        include: { business: true, messages: true, followUps: true, notes: true, deals: true }
      });

      await this.analytics.trackMany(
        [
          {
            eventType: EventType.LEAD_STATUS_CHANGED,
            city: lead.business.city,
            niche: lead.business.niche,
            leadId: id,
            value: 1,
            metadata: { fromStatus: lead.status, toStatus: status }
          },
          ...this.buildStatusEvents(status, lead.business.city, lead.business.niche, id)
        ],
        tx as Prisma.TransactionClient
      );

      await this.logs.create(
        {
          userId,
          leadId: id,
          action: 'lead.status_changed',
          details: { fromStatus: lead.status, toStatus: status }
        },
        tx as Prisma.TransactionClient
      );

      return updatedLead;
    });
  }

  private buildStatusEvents(status: LeadStatus, city: string, niche: string, leadId: string) {
    const events: Array<{ eventType: EventType; city: string; niche: string; leadId: string; value: number; metadata?: Prisma.InputJsonValue }> = [];

    if (status === LeadStatus.REPLIED) {
      events.push({ eventType: EventType.REPLY_RECEIVED, city, niche, leadId, value: 1 });
    }

    if (status === LeadStatus.MEETING) {
      events.push({ eventType: EventType.MEETING_SCHEDULED, city, niche, leadId, value: 1 });
    }

    if (status === LeadStatus.WON) {
      events.push({ eventType: EventType.DEAL_CLOSED, city, niche, leadId, value: 1, metadata: { status } });
    }

    return events;
  }

  private async enqueueFollowUpJob(input: { followUpId: string; leadId: string; userId: string; scheduledFor: Date }) {
    const delayMs = Math.max(0, input.scheduledFor.getTime() - Date.now());

    try {
      await this.followUpQueue.add(
        'send-followup',
        { followUpId: input.followUpId, leadId: input.leadId, userId: input.userId },
        {
          jobId: `followup:${input.followUpId}`,
          delay: delayMs,
          attempts: 5,
          backoff: { type: 'exponential', delay: 60_000 },
          removeOnComplete: { count: 500 },
          removeOnFail: false
        }
      );

      await this.prisma.followUp.update({
        where: { id: input.followUpId },
        data: { status: 'queued' }
      });

      return 'queued';
    } catch (error) {
      const serialized = this.serializeError(error);
      this.logger.error(`Failed to enqueue follow-up ${input.followUpId}: ${serialized}`);

      await this.prisma.followUp.updateMany({
        where: { id: input.followUpId, executedAt: null },
        data: { status: 'queue_failed' }
      });
      await this.logs.create({
        userId: input.userId,
        leadId: input.leadId,
        action: 'followup.queue_failed',
        details: { followUpId: input.followUpId, error: serialized }
      });

      return 'queue_failed';
    }
  }

  private serializeError(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
=======

    const now = new Date();
    const message = await this.prisma.message.create({
      data: {
        leadId,
        userId,
        content,
        direction: 'OUTBOUND',
        type: MessageType.FIRST_CONTACT,
        approved: true,
        sentAt: now
      }
    });

    const nextFollowUpDate = this.plusDays(now, 3);
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: LeadStatus.SENT, firstApprovedAt: now, contactedAt: now, lastContactDate: now, nextFollowUpDate }
    });
    await this.analytics.track('MESSAGE_SENT', lead.business.city, lead.business.niche, leadId, 1);
    await this.logActivity(userId, leadId, 'FIRST_MESSAGE_APPROVED_AND_SENT', { messageId: message.id, nextFollowUpDate });

    await this.scheduleFollowUp(leadId, userId, 1);
    return message;
  }

  async scheduleFollowUp(leadId: string, userId: string, step: number) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId }, include: { business: true } });
    if (!lead || lead.status === LeadStatus.DISCARDED) return;

    const scheduledFor = this.plusDays(new Date(), 3 * step);
    const content = await this.ai.generateFollowUp({ lead: lead.business, step });
    const followUp = await this.prisma.followUp.create({ data: { leadId, scheduledFor, content } });
    const delayMs = Math.max(0, followUp.scheduledFor.getTime() - Date.now());

    await this.followUpQueue.add('send-followup', { followUpId: followUp.id, leadId, userId }, { delay: delayMs });
    await this.logActivity(userId, leadId, 'FOLLOW_UP_SCHEDULED', { followUpId: followUp.id, scheduledFor, step });
  }

  async followUpQueueOverview() {
    const now = new Date();
    const followUps = await this.prisma.followUp.findMany({
      include: { lead: { include: { business: true } } },
      orderBy: [{ scheduledFor: 'asc' }]
    });

    return {
      overdue: followUps.filter((followUp) => !followUp.executedAt && followUp.scheduledFor < now),
      upcoming: followUps.filter((followUp) => !followUp.executedAt && followUp.scheduledFor >= now),
      completed: followUps.filter((followUp) => !!followUp.executedAt)
    };
  }

  async completeFollowUp(followUpId: string, userId: string) {
    const followUp = await this.prisma.followUp.findUnique({ where: { id: followUpId }, include: { lead: true } });
    if (!followUp) throw new NotFoundException('Follow-up not found');

    const updated = await this.prisma.followUp.update({
      where: { id: followUpId },
      data: { status: 'completed', executedAt: followUp.executedAt ?? new Date() }
    });

    await this.logActivity(userId, followUp.leadId, 'FOLLOW_UP_COMPLETED', { followUpId });
    return updated;
  }

  async rescheduleFollowUp(followUpId: string, userId: string, scheduledFor: Date) {
    const followUp = await this.prisma.followUp.findUnique({ where: { id: followUpId }, include: { lead: true } });
    if (!followUp) throw new NotFoundException('Follow-up not found');

    const updated = await this.prisma.followUp.update({
      where: { id: followUpId },
      data: { scheduledFor, status: 'queued', executedAt: null }
    });

    const delayMs = Math.max(0, scheduledFor.getTime() - Date.now());
    await this.followUpQueue.add(
      'send-followup',
      { followUpId: followUp.id, leadId: followUp.leadId, userId },
      { delay: delayMs }
    );

    await this.logActivity(userId, followUp.leadId, 'FOLLOW_UP_RESCHEDULED', { followUpId, scheduledFor });
    return updated;
  }

  async registerReply(leadId: string, userId: string, content: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId }, include: { business: true } });
    if (!lead) throw new NotFoundException('Lead not found');

    const now = new Date();
    const message = await this.prisma.message.create({
      data: {
        leadId,
        userId,
        content,
        direction: 'INBOUND',
        type: MessageType.RESPONSE,
        approved: true,
        sentAt: now
      }
    });

    await this.prisma.lead.update({ where: { id: leadId }, data: { status: LeadStatus.REPLIED, lastContactDate: now } });
    await this.analytics.track('REPLY_RECEIVED', lead.business.city, lead.business.niche, lead.id, 1);
    await this.logActivity(userId, lead.id, 'REPLY_RECORDED', { messageId: message.id, at: now });

    return message;
  }

  async updateStatus(id: string, status: LeadStatus, userId?: string) {
    const previous = await this.prisma.lead.findUnique({ where: { id }, include: { business: true } });
    if (!previous) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.lead.update({
      where: { id },
      data: { status, discardedAt: status === LeadStatus.DISCARDED ? new Date() : null }
    });

    const eventType = this.analyticsEventForStatus(status);
    if (eventType) {
      await this.analytics.track(eventType, previous.business.city, previous.business.niche, id, 1);
    }

    if (userId) {
      await this.logActivity(userId, id, 'LEAD_STATUS_UPDATED', { from: previous.status, to: status });
    }

    return updated;
  }

  private analyticsEventForStatus(status: LeadStatus): EventType | null {
    if (status === LeadStatus.SENT) return EventType.MESSAGE_SENT;
    if (status === LeadStatus.REPLIED) return EventType.REPLY_RECEIVED;
    if (status === LeadStatus.INTERESTED || status === LeadStatus.MEETING) return EventType.MEETING_SCHEDULED;
    if (status === LeadStatus.WON) return EventType.DEAL_CLOSED;
    return null;
  }

  private async logActivity(userId: string, leadId: string, action: string, details?: Record<string, unknown>) {
    await this.prisma.activityLog.create({ data: { userId, leadId, action, details } });
>>>>>>> theirs
  }

  private plusDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }
}
