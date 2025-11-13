import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateJobStatusUpdateDto {
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;
}
