import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class QueryJobStatusUpdateDTO {
  @IsOptional()
  @IsString()
  @IsIn([
    'id',
    'jobId',
    'description',
    'completed',
    'location',
    'time',
    'date',
    'createdAt',
  ])
  sortBy?:
    | 'id'
    | 'jobId'
    | 'description'
    | 'completed'
    | 'location'
    | 'time'
    | 'createdAt'
    | 'date' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsString()
  trackingId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
