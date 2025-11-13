import { CreateWarehouseJob } from './create-warehouse-job.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWarehouseJob extends PartialType(CreateWarehouseJob) {}
