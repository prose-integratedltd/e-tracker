import { PartialType } from '@nestjs/mapped-types';
import { CreateJobTypeDto } from './create-job.type.dto';
import { IsString } from 'class-validator';

export class UpdateJobTypeDto extends PartialType(CreateJobTypeDto) {
  @IsString()
  name: string;
}
