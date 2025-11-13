import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
  ConflictException,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto.ts';
import { NotificationType, Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/role.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { FindWhereDto } from './dto/find.where.dto';
import { QueryUserDTO } from './dto/query.user.dto';
import formatDate from 'src/date.format';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Post('add')
  @Roles(Role.admin)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createUserDto: CreateUserDto, @Request() request) {
    const select = { id: true };

    const user = await Promise.all([
      this.userService.findWhere(
        {
          email: createUserDto.email,
        } as FindWhereDto,
        select,
      ),
      this.userService.findWhere(
        {
          username: createUserDto.username,
        } as FindWhereDto,
        select,
      ),
    ]);

    if (user[0]) throw new ConflictException('User already exist');
    if (user[1]) throw new ConflictException('Username already taken');

    const newUser = await this.userService.create(createUserDto);

    await this.notificationService.create({
      title: 'User Account Created',
      message: `User ID {id-link}, created by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      userId: request['user']['id'],
      type: NotificationType.User,
      data: newUser,
    });

    return newUser;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() request,
  ) {
    const user = await Promise.all([
      this.userService.findWhere({ id } as FindWhereDto),
    ]);

    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.userService.update(id, updateUserDto);

    if (updateUserDto.suspended == true) {
      await this.notificationService.create({
        title: 'User Account Suspended',
        message: `User ID {id-link}, suspended by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
        type: NotificationType.User,
        userId: request['user']['id'],
        data: { id: updatedUser.id, uId: updatedUser.uId },
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

  @Post('signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() signinUserDto: SigninUserDto) {
    return this.userService.authenticate(signinUserDto);
  }

  @Get()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: QueryUserDTO) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string, @Request() request) {
    const user = await this.userService.remove(id);

    await this.notificationService.create({
      title: 'User Account Deleted',
      message: `User ID {id-link}, deleted by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.User,
      data: { id: user.id, uId: user.uId },
      userId: request['user']['id'],
    });

    return user;
  }
}
