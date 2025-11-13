import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationLocationDto } from './create-operation-location.dto';
import { IsUUID } from 'class-validator';

export class UpdateOperationLocationDto extends PartialType(
  CreateOperationLocationDto,
) {
  @IsUUID()
  id: string;
}
