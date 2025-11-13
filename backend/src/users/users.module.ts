import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, PrismaClient, JwtService, NotificationsService],
})
export class UsersModule {}
