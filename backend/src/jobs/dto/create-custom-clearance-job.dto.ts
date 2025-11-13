import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { JobStatus } from '@prisma/client';

export class CreateCustomClearanceJob {
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
  @IsNotEmpty({ message: 'Shipment type (shipmentType) is required' })
  shipmentType: string;

  @IsString()
  @IsNotEmpty({ message: 'Goods type (goodsType) is required' })
  goodsType: string;

  @IsString()
  @IsNotEmpty({ message: 'Clearing type (clearingType) is required' })
  clearingType: string;

  @IsString()
  @IsNotEmpty({
    message:
      'State available documentations (stateAvailableDocumentations) is required',
  })
  stateAvailableDocumentations: string;
}
