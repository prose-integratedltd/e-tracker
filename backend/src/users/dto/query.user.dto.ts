import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsIn,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class QueryUserDTO {
  @IsOptional()
  @IsString()
  @IsIn(['uId', 'username', 'email', 'fullname', 'phoneNumber', 'createdAt'])
  sortBy?:
    | 'uId'
    | 'username'
    | 'email'
    | 'fullname'
    | 'phoneNumber'
    | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
