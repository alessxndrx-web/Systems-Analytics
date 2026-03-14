import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { LeadStatus, MessageType } from '@prisma/client';
import { Queue } from 'bullmq';
import { AiService } from '../ai/ai.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private analytics: AnalyticsService,
    @InjectQueue('followups') private followUpQueue: Queue
  ) {}

  list(filters: { niche?: string; status?: LeadStatus; minScore?: number }) {
    return this.prisma.lead.findMany({
      where: {
        status: filters.status,
        score: filters.minScore ? { gte: filters.minScore } : undefined,
        business: filters.niche ? { niche: filters.niche } : undefined
      },
      include: { business: true },
      orderBy: { score: 'desc' }
    });
  }

  detail(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: { business: true, messages: true, followUps: true, notes: true, deals: true }
    });
  }

  async generateDraft(leadId: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId }, include: { business: true } });
    if (!lead) throw new NotFoundException('Lead not found');
    const content = await this.ai.generateFirstMessage({ leadId, business: lead.business });

    return this.prisma.message.create({
      data: { leadId, userId, content, direction: 'OUTBOUND', type: MessageType.FIRST_CONTACT, approved: false }
    });
  }

  async approveFirstMessage(leadId: string, userId: string, content: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId }, include: { business: true } });
    if (!lead || lead.status === 'DISCARDED') throw new NotFoundException('Lead unavailable');

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

    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: LeadStatus.SENT, firstApprovedAt: now, lastContactDate: now, nextFollowUpDate: this.plusDays(now, 3) }
    });
    await this.analytics.track('MESSAGE_SENT', lead.business.city, lead.business.niche, leadId, 1);

    await this.scheduleFollowUp(leadId, userId, 1);
    return message;
  }

  async scheduleFollowUp(leadId: string, userId: string, step: number) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId }, include: { business: true } });
    if (!lead || lead.status === 'DISCARDED') return;

    const scheduledFor = this.plusDays(new Date(), 3 * step);
    const content = await this.ai.generateFollowUp({ lead: lead.business, step });
    const followUp = await this.prisma.followUp.create({ data: { leadId, scheduledFor, content } });
    const delayMs = Math.max(0, followUp.scheduledFor.getTime() - Date.now());
    await this.followUpQueue.add('send-followup', { followUpId: followUp.id, leadId, userId }, { delay: delayMs });
  }

  updateStatus(id: string, status: LeadStatus) {
    return this.prisma.lead.update({
      where: { id },
      data: { status, discardedAt: status === LeadStatus.DISCARDED ? new Date() : null }
    });
  }

  private plusDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }
}
