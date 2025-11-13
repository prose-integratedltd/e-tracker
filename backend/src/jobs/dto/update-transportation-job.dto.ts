import { CreateTransportationJob } from './create-transportation-job.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTransportationJob extends PartialType(
  CreateTransportationJob,
) {}
