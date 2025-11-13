import { Module } from '@nestjs/common';
import { OperationLocationService } from './operation-location.service';
import { OperationLocationController } from './operation-location.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [OperationLocationController],
  providers: [OperationLocationService, PrismaClient, NotificationsService],
})
export class OperationLocationModule {}
