import {
  IsEnum,
  IsUUID,
  IsString,
  IsPhoneNumber,
  ArrayNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsPhoneNumber('NG', {
    message: 'Please enter a valid Nigerian number',
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  operationLocationId?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  suspended?: boolean;

  @IsOptional()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
