import { NotificationType } from '@prisma/client';
import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString({ message: 'Title (title) must be a string' })
  @IsNotEmpty({ message: 'Title (title) is required' })
  title: string;

  @IsString({ message: 'Message (message) must be a string' })
  @IsNotEmpty({ message: 'Message (message) is required' })
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsJSON()
  @IsNotEmpty()
  data: Record<string, any>;
}
