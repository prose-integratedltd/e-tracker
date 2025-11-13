import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, PrismaClient, NotificationsService],
})
export class DepartmentModule {}
