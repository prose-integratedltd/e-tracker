import { Test, TestingModule } from '@nestjs/testing';
import { JobStatusUpdatesService } from './job-status-updates.service';

describe('JobStatusUpdatesService', () => {
  let service: JobStatusUpdatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobStatusUpdatesService],
    }).compile();

    service = module.get<JobStatusUpdatesService>(JobStatusUpdatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
