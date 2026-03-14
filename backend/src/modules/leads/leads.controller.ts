import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApproveMessageDto } from './dto/approve-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  list(@Query('niche') niche?: string, @Query('status') status?: LeadStatus, @Query('minScore') minScore?: string) {
    return this.leadsService.list({ niche, status, minScore: minScore ? Number(minScore) : undefined });
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.leadsService.detail(id);
  }

  @Post(':id/draft')
  draft(@Param('id') id: string, @Req() req: { user: { userId: string } }) {
    return this.leadsService.generateDraft(id, req.user.userId);
  }

  @Post(':id/approve-first')
  approve(@Param('id') id: string, @Req() req: { user: { userId: string } }, @Body() dto: ApproveMessageDto) {
    return this.leadsService.approveFirstMessage(id, req.user.userId, dto.content);
  }

  @Patch(':id/status')
  status(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.leadsService.updateStatus(id, dto.status);
  }
}
