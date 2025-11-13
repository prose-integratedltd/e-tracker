import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { JobReviewsService } from './job-reviews.service';
import { CreateJobReviewDto } from './dto/create-job-review.dto';

@Controller('job-reviews')
export class JobReviewsController {
  constructor(private readonly jobReviewsService: JobReviewsService) {}

  @Post()
  create(@Body() createJobReviewDto: CreateJobReviewDto) {
    return this.jobReviewsService.create(createJobReviewDto);
  }

  @Get(':jobId')
  findOne(@Param('jobId') jobId: string) {
    return this.jobReviewsService.findOneByJobId(jobId);
  }
}
