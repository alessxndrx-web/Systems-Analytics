import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { SearchLeadsDto } from './dto/search-leads.dto';
import { MockPlacesProvider } from './providers/mock-places.provider';
import { PlaceCandidate } from './providers/places.interface';

@Injectable()
export class DiscoveryService {
  constructor(
    private prisma: PrismaService,
    private scoring: ScoringService,
    private analytics: AnalyticsService,
    private mockProvider: MockPlacesProvider
  ) {}

  async discover(userId: string, dto: SearchLeadsDto) {
    const places = await this.mockProvider.search(dto.city, dto.country, dto.niche);
    const leads = [];
    for (const place of places) {
      leads.push(await this.upsertLeadFromPlace(userId, place));
    }
    return leads;
  }

  private async upsertLeadFromPlace(userId: string, place: PlaceCandidate) {
    const business = await this.prisma.business.upsert({
      where: { externalId: place.externalId },
      update: {
        name: place.name,
        category: place.category,
        niche: place.niche,
        city: place.city,
        country: place.country,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        rating: place.rating,
        reviewCount: place.reviewCount,
        website: place.website,
        phone: place.phone,
        hasWhatsapp: !!place.phone,
        isOutdatedSite: !!place.website && place.website.includes('example')
      },
      create: {
        externalId: place.externalId,
        name: place.name,
        category: place.category,
        niche: place.niche,
        city: place.city,
        country: place.country,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        rating: place.rating,
        reviewCount: place.reviewCount,
        website: place.website,
        phone: place.phone,
        hasWhatsapp: !!place.phone,
        isOutdatedSite: !!place.website && place.website.includes('example')
      }
    });

    const score = await this.scoring.scoreBusiness(userId, business);
    const lead = await this.prisma.lead.upsert({
      where: { businessId: business.id },
      update: { score },
      create: { businessId: business.id, ownerId: userId, score }
    });

    await this.analytics.track('LEAD_DISCOVERED', business.city, business.niche, lead.id, 1);
    return this.prisma.lead.findUnique({ where: { id: lead.id }, include: { business: true } });
  }
}
