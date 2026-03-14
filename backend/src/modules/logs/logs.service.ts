import { Injectable } from '@nestjs/common';
<<<<<<< ours
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListLogsDto } from './dto/list-logs.dto';

type DbClient = Prisma.TransactionClient | PrismaService;

type ActivityLogPayload = {
  userId: string;
  action: string;
  leadId?: string;
  details?: Prisma.InputJsonValue;
};
=======
import { PrismaService } from '../prisma/prisma.service';
>>>>>>> theirs

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

<<<<<<< ours
  private db(client?: DbClient) {
    return client ?? this.prisma;
  }

  create(entry: ActivityLogPayload, client?: DbClient) {
    return this.db(client).activityLog.create({
      data: {
        userId: entry.userId,
        leadId: entry.leadId,
        action: entry.action,
        details: entry.details
      }
    });
  }

  async createMany(entries: ActivityLogPayload[], client?: DbClient) {
    for (const entry of entries) {
      await this.create(entry, client);
    }
  }

  async list(query: ListLogsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      this.prisma.activityLog.count()
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      pageCount: Math.max(1, Math.ceil(total / pageSize))
    };
=======
  list() {
    return this.prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
>>>>>>> theirs
  }
}
