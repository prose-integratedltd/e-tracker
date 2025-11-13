import { Module } from '@nestjs/common';
import { JobStatusUpdatesService } from './job-status-updates.service';
import { JobStatusUpdatesController } from './job-status-updates.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobStatusUpdatesController],
  providers: [JobStatusUpdatesService, PrismaClient, JwtService],
})
export class JobStatusUpdatesModule {}
