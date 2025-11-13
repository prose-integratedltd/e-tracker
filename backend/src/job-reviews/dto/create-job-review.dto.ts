import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Can not create review without a valid job ID' })
  jobId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Rating must not be less than 1' })
  @Max(5, { message: 'Rating must not be greater than 5' })
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
