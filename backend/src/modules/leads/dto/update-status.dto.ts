import { LeadStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(LeadStatus)
  status!: LeadStatus;
}
