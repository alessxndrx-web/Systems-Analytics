import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { LeadsModule } from './modules/leads/leads.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { AiModule } from './modules/ai/ai.module';
import { LogsModule } from './modules/logs/logs.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 200 }]),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: Number(config.get('REDIS_PORT', 6379))
        }
      })
    }),
    PrismaModule,
    AuthModule,
    DiscoveryModule,
    ScoringModule,
    AiModule,
    LeadsModule,
    AnalyticsModule,
    LogsModule,
    HealthModule
  ]
})
export class AppModule {}
