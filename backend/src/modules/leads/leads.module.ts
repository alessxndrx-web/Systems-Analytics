import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AnalyticsModule } from '../analytics/analytics.module';
<<<<<<< ours
import { LogsModule } from '../logs/logs.module';
=======
>>>>>>> theirs
import { FollowUpProcessor } from './followup.processor';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
<<<<<<< ours
  imports: [AiModule, AnalyticsModule, LogsModule, BullModule.registerQueue({ name: 'followups' })],
=======
  imports: [AiModule, AnalyticsModule, BullModule.registerQueue({ name: 'followups' })],
>>>>>>> theirs
  providers: [LeadsService, FollowUpProcessor],
  controllers: [LeadsController],
  exports: [LeadsService]
})
export class LeadsModule {}
