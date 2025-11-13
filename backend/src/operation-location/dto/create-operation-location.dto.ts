import { IsString } from 'class-validator';

export class CreateOperationLocationDto {
  @IsString()
  name: string;
}
