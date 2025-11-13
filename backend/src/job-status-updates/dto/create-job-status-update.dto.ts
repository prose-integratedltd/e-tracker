import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Address } from './address.dto';

export class CreateJobStatusUpdateDto {
  @IsString()
  @IsNotEmpty({ message: 'Job ID (jobId) is required' })
  jobId: string;

  @IsString()
  @IsNotEmpty({ message: 'Title (title) is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  location?: Address;

  @IsOptional()
  @IsMilitaryTime()
  @IsNotEmpty({ message: 'Time (time) is required' })
  time?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Date (date) is required' })
  date: string;
}
