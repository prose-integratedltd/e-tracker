import { Prisma } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty({ message: 'To (to) is required' })
  to: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject (subject) is required' })
  subject: string;

  @IsString()
  @IsOptional()
  htmlBody: string;

  @IsString()
  @IsOptional()
  textBody: string;

  @IsOptional()
  @IsArray()
  attachments?: Prisma.JsonArray[] = [];
}
