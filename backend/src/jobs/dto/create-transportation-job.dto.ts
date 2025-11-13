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
import { Address } from 'src/job-status-updates/dto/address.dto';
import { JobStatus, TransportMode } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateTransportationJob {
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

  @IsNotEmpty({ message: 'Transport Mode (transportMode) is required' })
  @IsEnum(TransportMode)
  transportMode: TransportMode;

  @IsString()
  @IsNotEmpty({
    message: 'Transport system (transportSystem) is required',
  })
  transportSystem: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  pickupLocation?: Address;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  moreLocations?: Address;

  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  deliveryLocation: Address;

  @IsString()
  @IsNotEmpty({
    message: 'Driver name (driverName) is required',
  })
  driverName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Driver phoneNumber (driverPhoneNumber) is required',
  })
  driverPhoneNumber: string;

  @IsString()
  @IsNotEmpty({
    message: 'Driver license (driverLicense) is required',
  })
  driverLicense: string;

  @IsString()
  @IsNotEmpty({
    message: 'Driver date of birth (driverDateOfBirth) is required',
  })
  driverDateOfBirth: string;
}
