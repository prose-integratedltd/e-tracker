import {
  Controller,
  Get,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Request,
  Patch,
  Body,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { Roles } from 'src/users/roles/role.decorator';
import { NotificationType, Role } from '@prisma/client';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FindWhereDto } from 'src/users/dto/find.where.dto';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import formatDate from 'src/date.format';

@Controller('auth')
@UsePipes(ValidationPipe)
@Roles(Role.admin, Role.user)
@UseGuards(AuthGuard, RolesGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Get('/user')
  findOne(@Request() request: Request) {
    return this.authService.findOne(request['user']['email']);
  }

  @Patch('/user')
  @UsePipes(ValidationPipe)
  async update(@Body() updateUserDto: UpdateUserDto, @Request() request) {
    const id = request['user']['id'];
    const user = await this.userService.findWhere({ id } as FindWhereDto);

    if (!user) throw new NotFoundException('User not found');

    if (request['user']['id'] !== user.id) {
      throw new UnauthorizedException(
        "Unable to update another user's profile",
      );
    }

    const updatedUser = await this.userService.update(id, updateUserDto);

    if (updateUserDto.suspended == true) {
      await this.notificationService.create({
        title: 'User Account Suspended',
        message: `User ID {id-link}, suspended by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
        type: NotificationType.User,
        data: { id: updatedUser.id, uId: updatedUser.uId },
        userId: request['user']['id'],
      });
    } else if (updateUserDto.suspended == false) {
      await this.notificationService.create({
        title: 'User Account Unsuspended',
        message: `User ID {id-link}, unsuspended by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
        type: NotificationType.User,
        data: { id: updatedUser.id, uId: updatedUser.uId },
        userId: request['user']['id'],
      });
    } else {
      await this.notificationService.create({
        title: 'User Account Updated',
        message: `User ID {id-link}, updated by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
        type: NotificationType.User,
        data: { id: updatedUser.id, uId: updatedUser.uId },
        userId: request['user']['id'],
      });
    }

    return updatedUser;
  }
}
