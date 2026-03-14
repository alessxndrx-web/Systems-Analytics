import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApproveMessageDto } from './dto/approve-message.dto';
<<<<<<< ours
=======
import { RegisterReplyDto } from './dto/register-reply.dto';
import { RescheduleFollowupDto } from './dto/reschedule-followup.dto';
>>>>>>> theirs
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

<<<<<<< ours
=======
  @Get('drafts')
  drafts() {
    return this.leadsService.listDrafts();
  }

  @Get('followups/queue')
  followupQueue() {
    return this.leadsService.followUpQueueOverview();
  }


  @Patch('drafts/:id/reject')
  rejectDraft(@Param('id') id: string, @Req() req: { user: { userId: string } }) {
    return this.leadsService.rejectDraft(id, req.user.userId);
  }

  @Patch('followups/:id/complete')
  completeFollowUp(@Param('id') id: string, @Req() req: { user: { userId: string } }) {
    return this.leadsService.completeFollowUp(id, req.user.userId);
  }

  @Patch('followups/:id/reschedule')
  rescheduleFollowUp(
    @Param('id') id: string,
    @Req() req: { user: { userId: string } },
    @Body() dto: RescheduleFollowupDto
  ) {
    return this.leadsService.rescheduleFollowUp(id, req.user.userId, new Date(dto.scheduledFor));
  }

>>>>>>> theirs
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

<<<<<<< ours
  @Patch(':id/status')
  status(@Param('id') id: string, @Req() req: { user: { userId: string } }, @Body() dto: UpdateStatusDto) {
    return this.leadsService.updateStatus(id, req.user.userId, dto.status);
=======
  @Post(':id/reply')
  reply(@Param('id') id: string, @Req() req: { user: { userId: string } }, @Body() dto: RegisterReplyDto) {
    return this.leadsService.registerReply(id, req.user.userId, dto.content ?? 'Reply received from operator log');
  }

  @Patch(':id/status')
  status(@Param('id') id: string, @Req() req: { user: { userId: string } }, @Body() dto: UpdateStatusDto) {
    return this.leadsService.updateStatus(id, dto.status, req.user.userId);
>>>>>>> theirs
  }
}
