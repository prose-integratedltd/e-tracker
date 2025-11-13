import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaClient } from '@prisma/client';
import { JobTypesService } from 'src/job.types/job.types.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [JobsController],
  providers: [
    JobsService,
    PrismaClient,
    JobTypesService,
    JwtService,
    NotificationsService,
    UsersService,
  ],
})
export class JobsModule {}
