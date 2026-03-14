import { IsOptional, IsString } from 'class-validator';

export class RegisterReplyDto {
  @IsString()
  @IsOptional()
  content?: string;
}
