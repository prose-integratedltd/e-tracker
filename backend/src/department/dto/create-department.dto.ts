import { IsAlpha } from 'class-validator';

export class CreateDepartmentDto {
  @IsAlpha()
  name: string;
}
