import { CreateJobReviewDto } from './dto/create-job-review.dto';
import { PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class JobReviewsService {
  constructor(private readonly prisma: PrismaClient) {}

  create(dto: CreateJobReviewDto) {
    return this.prisma.jobReview.create({ data: dto });
  }

  async findOneByJobId(jobId: string) {
    const review = await this.prisma.jobReview.findFirst({
      where: { jobId: jobId },
    });

    if (!review) throw new NotFoundException('Job review not found');

    return review;
  }
}
