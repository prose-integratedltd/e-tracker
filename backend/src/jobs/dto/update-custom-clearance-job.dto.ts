import { CreateCustomClearanceJob } from './create-custom-clearance-job.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCustomClearanceJob extends PartialType(
  CreateCustomClearanceJob,
) {}
