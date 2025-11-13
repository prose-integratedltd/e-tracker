import { IsString } from 'class-validator';

export class CreateJobTypeDto {
  @IsString()
  name: string;
}
