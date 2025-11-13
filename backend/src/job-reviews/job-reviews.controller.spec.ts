import { Test, TestingModule } from '@nestjs/testing';
import { JobReviewsController } from './job-reviews.controller';
import { JobReviewsService } from './job-reviews.service';

describe('JobReviewsController', () => {
  let controller: JobReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobReviewsController],
      providers: [JobReviewsService],
    }).compile();

    controller = module.get<JobReviewsController>(JobReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
