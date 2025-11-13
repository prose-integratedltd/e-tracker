import { Test, TestingModule } from '@nestjs/testing';
import { JobStatusUpdatesController } from './job-status-updates.controller';
import { JobStatusUpdatesService } from './job-status-updates.service';

describe('JobStatusUpdatesController', () => {
  let controller: JobStatusUpdatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobStatusUpdatesController],
      providers: [JobStatusUpdatesService],
    }).compile();

    controller = module.get<JobStatusUpdatesController>(
      JobStatusUpdatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
