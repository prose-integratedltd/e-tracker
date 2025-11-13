import {
  IsDateString,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { JobStatus, TransportMode } from '@prisma/client';

export class CreateJobDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Job type (typeId) is required' })
  typeId: string;

  @IsString({ message: 'Name (name) must be a string' })
  @IsNotEmpty({ message: 'Name (name) is required' })
  name: string;

  @IsNotEmpty({ message: 'Transport Mode (transportMode) is required' })
  @IsEnum(TransportMode)
  transportMode: TransportMode;

  @IsString()
  @IsNotEmpty({ message: 'Client name (clientName) is required' })
  clientName: string;

  @IsString()
  @IsNotEmpty({ message: 'Service type (serviceType) is required' })
  serviceType: string;

  @IsDateString()
  @IsNotEmpty({
    message: 'Expected delivery (expectedDeliveryDate) date required',
  })
  expectedDeliveryDate: string;

  @IsMilitaryTime()
  @IsNotEmpty({ message: 'Arrival time (arrivalTime) required' })
  arrivalTime: string;

  @IsMilitaryTime()
  @IsNotEmpty({ message: 'Departure time (departure time) required' })
  departureTime: string;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle Type (vehicleType) is required' })
  vehicleType: string;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle Colour (vehicleColour) is required' })
  vehicleColour: string;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle Number (vehicleNumber) is required' })
  vehicleNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle tannage (vehicleTannage) is required' })
  vehicleTannage: string;

  @IsString()
  @IsNotEmpty({ message: 'Driver name (driverName) is required' })
  driverName: string;

  @IsPhoneNumber('NG', {
    message: 'Invalid Nigerian phone number (phoneNumber)',
  })
  driverPhoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Transport type (transportType) is required' })
  transportType: string;

  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.Open;

  @IsString()
  @IsNotEmpty({ message: 'Description (description) is required' })
  description: string;
}
