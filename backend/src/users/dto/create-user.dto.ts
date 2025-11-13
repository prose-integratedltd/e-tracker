import { Role } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter a username' })
  username: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Please enter your email' })
  email: string;

  @IsPhoneNumber('NG', {
    message: 'Please enter a valid Nigerian number',
  })
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter a full name' })
  fullname: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Please enter a department ID' })
  departmentId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Please enter a operationLocation ID' })
  operationLocationId: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter a password' })
  @MinLength(6, { message: 'Enter at least 6 or more characters' })
  password: string;

  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
