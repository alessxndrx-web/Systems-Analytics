import { IsString } from 'class-validator';

export class ApproveMessageDto {
  @IsString()
  content!: string;
}
