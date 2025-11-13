import { JobReviewsController } from './job-reviews.controller';
import { JobReviewsService } from './job-reviews.service';
import { PrismaClient } from '@prisma/client';
import { Module } from '@nestjs/common';

@Module({
  controllers: [JobReviewsController],
  providers: [JobReviewsService, PrismaClient],
})
export class JobReviewsModule {}
