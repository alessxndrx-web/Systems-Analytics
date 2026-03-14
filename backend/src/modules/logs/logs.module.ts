import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

<<<<<<< ours
@Module({ providers: [LogsService], controllers: [LogsController], exports: [LogsService] })
=======
@Module({ providers: [LogsService], controllers: [LogsController] })
>>>>>>> theirs
export class LogsModule {}
