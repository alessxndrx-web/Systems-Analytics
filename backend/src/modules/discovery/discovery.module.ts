import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { ScoringModule } from '../scoring/scoring.module';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { GooglePlacesProvider } from './providers/google-places.provider';
import { MockPlacesProvider } from './providers/mock-places.provider';

@Module({
  imports: [ScoringModule, AnalyticsModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService, MockPlacesProvider, GooglePlacesProvider]
})
export class DiscoveryModule {}
