import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsObject,
} from 'class-validator';
import { JobStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { Address } from 'src/job-status-updates/dto/address.dto';

export class CreateCarHireJob {
  @IsUUID()
  @IsNotEmpty({ message: 'Job type (typeId) is required' })
  typeId: string;

  @IsString()
  @IsNotEmpty({ message: 'Name (name) is required' })
  name?: string;

  @IsObject()
  @Type(() => Address)
  @IsNotEmpty({ message: 'Pickup location (pickupLocation) is required' })
  pickupLocation?: Address;

  @IsObject()
  @Type(() => Address)
  @IsNotEmpty({ message: 'Pickup location (dropOffLocation) is required' })
  dropOffLocation?: Address;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Client name (clientName) is required' })
  clientName: string;

  @IsString()
  @IsOptional()
  passenger?: string;

  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.Open;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle Type (vehicleType) is required' })
  vehicleType: string;

  @IsString()
  @IsNotEmpty({ message: 'Car Service Type (carServiceType) is required' })
  carServiceType: string;
}
