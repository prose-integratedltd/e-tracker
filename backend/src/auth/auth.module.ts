import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [AuthController],

  providers: [
    AuthService,
    PrismaClient,
    JwtService,
    UsersService,
    NotificationsService,
  ],
})
export class AuthModule {}
