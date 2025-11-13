import { Test, TestingModule } from '@nestjs/testing';
import { JobReviewsService } from './job-reviews.service';

describe('JobReviewsService', () => {
  let service: JobReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobReviewsService],
    }).compile();

    service = module.get<JobReviewsService>(JobReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
