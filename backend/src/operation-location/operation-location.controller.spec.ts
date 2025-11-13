import { Test, TestingModule } from '@nestjs/testing';
import { OperationLocationController } from './operation-location.controller';
import { OperationLocationService } from './operation-location.service';

describe('OperationLocationController', () => {
  let controller: OperationLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationLocationController],
      providers: [OperationLocationService],
    }).compile();

    controller = module.get<OperationLocationController>(OperationLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
