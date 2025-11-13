import { CreateJobReviewDto } from './create-job-review.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateJobReviewDto extends PartialType(CreateJobReviewDto) {}
