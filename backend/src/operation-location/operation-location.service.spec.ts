import { Test, TestingModule } from '@nestjs/testing';
import { OperationLocationService } from './operation-location.service';

describe('OperationLocationService', () => {
  let service: OperationLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationLocationService],
    }).compile();

    service = module.get<OperationLocationService>(OperationLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
