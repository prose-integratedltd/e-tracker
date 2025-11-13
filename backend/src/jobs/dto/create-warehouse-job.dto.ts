import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { JobStatus } from '@prisma/client';

export class CreateWarehouseJob {
  @IsUUID()
  @IsNotEmpty({ message: 'Job type (typeId) is required' })
  typeId: string;

  @IsString()
  @IsNotEmpty({ message: 'Name (name) is required' })
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Client name (clientName) is required' })
  clientName: string;

  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.Open;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsNotEmpty({ message: 'Goods type (goodsType) is required' })
  goodsType: string;

  @IsString()
  @IsNotEmpty({ message: 'Warehouse size (warehouseSize) is required' })
  warehouseSize: string;

  @IsString()
  @IsNotEmpty({
    message: 'Scheduled operation date (scheduledOperationDate) is required',
  })
  scheduledOperationDate: string;

  @IsString()
  @IsNotEmpty({
    message: 'Goods name (goodsName) is required',
  })
  goodsName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Duration (duration) is required',
  })
  duration: string;
}
