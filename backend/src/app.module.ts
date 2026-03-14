import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
<<<<<<< ours
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { validateEnv } from './config/env.validation';
=======
import { ThrottlerModule } from '@nestjs/throttler';
>>>>>>> theirs
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { LeadsModule } from './modules/leads/leads.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { AiModule } from './modules/ai/ai.module';
import { LogsModule } from './modules/logs/logs.module';
import { HealthModule } from './modules/health/health.module';

<<<<<<< ours
function buildRedisConnection(config: ConfigService) {
  const redisUrl = config.get<string>('REDIS_URL');
  if (redisUrl) {
    const parsed = new URL(redisUrl);
    const dbPath = parsed.pathname.replace('/', '');

    return {
      host: parsed.hostname,
      port: Number(parsed.port || 6379),
      username: parsed.username || undefined,
      password: parsed.password || undefined,
      db: dbPath ? Number(dbPath) : undefined
    };
  }

  return {
    host: config.getOrThrow<string>('REDIS_HOST'),
    port: Number(config.getOrThrow<string>('REDIS_PORT'))
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
=======
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
>>>>>>> theirs
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 200 }]),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
<<<<<<< ours
        connection: buildRedisConnection(config)
=======
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: Number(config.get('REDIS_PORT', 6379))
        }
>>>>>>> theirs
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
<<<<<<< ours
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
=======
>>>>>>> theirs
  ]
})
export class AppModule {}
