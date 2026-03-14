import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScoringService } from './scoring.service';

class UpdateRuleDto {
  @IsString()
  key!: string;

  @IsInt()
  weight!: number;
}

@ApiTags('scoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Get('rules')
  rules(@Req() req: { user: { userId: string } }) {
    return this.scoringService.listRules(req.user.userId);
  }

  @Patch('rules')
  update(@Req() req: { user: { userId: string } }, @Body() dto: UpdateRuleDto) {
    return this.scoringService.updateRule(req.user.userId, dto.key, dto.weight);
  }
}
