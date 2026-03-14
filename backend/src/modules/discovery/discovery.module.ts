import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
<<<<<<< ours
import { LogsModule } from '../logs/logs.module';
=======
>>>>>>> theirs
import { ScoringModule } from '../scoring/scoring.module';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { GooglePlacesProvider } from './providers/google-places.provider';
import { MockPlacesProvider } from './providers/mock-places.provider';

@Module({
<<<<<<< ours
  imports: [ScoringModule, AnalyticsModule, LogsModule],
=======
  imports: [ScoringModule, AnalyticsModule],
>>>>>>> theirs
  controllers: [DiscoveryController],
  providers: [DiscoveryService, MockPlacesProvider, GooglePlacesProvider]
})
export class DiscoveryModule {}
