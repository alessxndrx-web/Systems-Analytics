import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { FollowUpProcessor } from './followup.processor';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [AiModule, AnalyticsModule, BullModule.registerQueue({ name: 'followups' })],
  providers: [LeadsService, FollowUpProcessor],
  controllers: [LeadsController],
  exports: [LeadsService]
})
export class LeadsModule {}
