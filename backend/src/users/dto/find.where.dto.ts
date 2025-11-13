import { IsEmail, IsOptional, IsString } from 'class-validator';

export class FindWhereDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  uId: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username: string;
}
