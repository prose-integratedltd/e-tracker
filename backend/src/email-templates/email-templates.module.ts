import { Module } from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplatesController } from './email-templates.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [EmailTemplatesController],
  providers: [
    EmailTemplatesService,
    PrismaClient,
    JwtService,
    NotificationsService,
    UsersService,
  ],
})
export class EmailTemplatesModule {}
