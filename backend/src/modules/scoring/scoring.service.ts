import { Injectable } from '@nestjs/common';
import { Business } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  async scoreBusiness(userId: string, business: Business) {
    const rules = await this.prisma.scoringRule.findMany({ where: { userId, enabled: true } });
    const map = new Map(rules.map((rule) => [rule.key, rule.weight]));

    let score = 50;
    if (!business.website) score += map.get('no_website') ?? 0;
    if (business.isOutdatedSite) score += map.get('outdated_website') ?? 0;
    if ((business.reviewCount ?? 0) < 30) score += map.get('low_reviews') ?? 0;
    if (['gyms', 'lawyers', 'clinics', 'florists', 'stores', 'restaurants'].includes(business.niche)) {
      score += map.get('niche_fit') ?? 0;
    }
    if (business.hasWhatsapp) score += map.get('whatsapp_visible') ?? 0;
    if (!business.isChain) score += map.get('local_business') ?? 0;
    if (business.isChain) score += map.get('chain_brand') ?? 0;

    return Math.max(0, Math.min(100, score));
  }

  listRules(userId: string) {
    return this.prisma.scoringRule.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  }

  updateRule(userId: string, key: string, weight: number) {
    return this.prisma.scoringRule.update({
      where: { userId_key: { userId, key } },
      data: { weight }
    });
  }
}
