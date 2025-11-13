import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import {
  IsMilitaryTime,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { JobStatus, TransportMode } from '@prisma/client';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsUUID()
  @IsOptional()
  typeId?: string;

  @IsString({ message: 'Name (name) must be a string' })
  @IsOptional()
  name?: string;

  @IsEnum(TransportMode)
  @IsOptional()
  transportMode?: TransportMode;

  @IsString({ message: 'Client name (clientName) must be a string' })
  @IsOptional()
  clientName?: string;

  @IsString({ message: 'Service type (serviceType) must be a string' })
  @IsOptional()
  serviceType?: string;

  @IsDateString()
  @IsOptional()
  expectedDeliveryDate?: string;

  @IsMilitaryTime()
  @IsOptional()
  arrivalTime?: string;

  @IsMilitaryTime()
  @IsOptional()
  departureTime: string;

  @IsString()
  @IsOptional()
  vehicleType?: string;

  @IsString()
  @IsOptional()
  vehicleColour?: string;

  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @IsString()
  @IsOptional()
  vehicleTannage?: string;

  @IsString()
  @IsOptional()
  driverName?: string;

  @IsPhoneNumber('NG', {
    message: 'Invalid Nigerian phone number (phoneNumber)',
  })
  @IsOptional()
  driverPhoneNumber?: string;

  @IsString()
  @IsOptional()
  transportType?: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @IsString()
  @IsOptional()
  description?: string;
}
