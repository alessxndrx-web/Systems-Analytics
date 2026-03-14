import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { SearchLeadsDto } from './dto/search-leads.dto';
import { GooglePlacesProvider } from './providers/google-places.provider';
import { MockPlacesProvider } from './providers/mock-places.provider';
import { PlaceCandidate, PlacesProvider } from './providers/places.interface';

@Injectable()
export class DiscoveryService {
  private readonly logger = new Logger(DiscoveryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringService,
    private readonly analytics: AnalyticsService,
    private readonly configService: ConfigService,
    private readonly mockProvider: MockPlacesProvider,
    private readonly googleProvider: GooglePlacesProvider
  ) {}

  async discover(userId: string, dto: SearchLeadsDto) {
    const provider = this.resolveProvider();
    const places = await provider.search(dto.city, dto.country, dto.niche);
    const leads = [];

    for (const place of places) {
      leads.push(await this.upsertLeadFromPlace(userId, place));
    }

    return leads;
  }

  private resolveProvider(): PlacesProvider {
    const hasGoogleKey = !!this.configService.get<string>('GOOGLE_PLACES_API_KEY');
    if (hasGoogleKey) {
      return this.googleProvider;
    }

    this.logger.log('GOOGLE_PLACES_API_KEY not set, using MockPlacesProvider fallback');
    return this.mockProvider;
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
