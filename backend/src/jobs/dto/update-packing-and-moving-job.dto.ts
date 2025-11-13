import { CreatePackingAndMovingJob } from './create-packing-and-moving-job.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePackingAndMovingJob extends PartialType(
  CreatePackingAndMovingJob,
) {}
