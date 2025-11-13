import {
  ValidateNested,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { JobStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { Address } from 'src/job-status-updates/dto/address.dto';

export class CreatePackingAndMovingJob {
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

  @IsObject()
  @Type(() => Address)
  packingLocation: Address;

  @IsObject()
  @Type(() => Address)
  deliveryLocation: Address;

  @IsString()
  @IsNotEmpty({ message: 'Movement type (movementType) is required' })
  movementType: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  moreLocations?: Address;
}
