import { CreateCarHireJob } from './create-car-hire-job.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCarHireJob extends PartialType(CreateCarHireJob, {
  skipNullProperties: true,
}) {}
