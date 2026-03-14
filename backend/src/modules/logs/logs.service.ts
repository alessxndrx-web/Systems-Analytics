import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  }
}
