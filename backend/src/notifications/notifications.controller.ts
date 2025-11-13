import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { QueryNotificationDTO } from './dto/query-notification.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @Query() queryNotificationDto: QueryNotificationDTO,
    @Request() request,
  ) {
    const isAdmin = request['user']['roles'].includes('admin') ?? false;
    return this.notificationsService.findAll(
      queryNotificationDto,
      isAdmin,
      request['user']['id'],
    );
  }

  @Delete('clear')
  clear(@Request() request) {
    const isAdmin = request['user']['roles'].includes('admin') ?? false;
    return this.notificationsService.clear(isAdmin, request['user']['id']);
  }

  @Patch('mark-as-seen')
  markAsSeen(@Body('ids') ids: string[]) {
    return this.notificationsService.markAsSeen(ids);
  }
}
