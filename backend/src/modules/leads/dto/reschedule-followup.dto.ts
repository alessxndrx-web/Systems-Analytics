import { IsDateString } from 'class-validator';

export class RescheduleFollowupDto {
  @IsDateString()
  scheduledFor!: string;
}
