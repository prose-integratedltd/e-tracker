import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OperationLocationService } from './operation-location.service';
import { CreateOperationLocationDto } from './dto/create-operation-location.dto';
import { UpdateOperationLocationDto } from './dto/update-operation-location.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Controller('operation-locations')
export class OperationLocationController {
  constructor(
    private readonly operationLocationService: OperationLocationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createOperationLocationDto: CreateOperationLocationDto) {
    const location = await this.operationLocationService.create(
      createOperationLocationDto,
    );

    this.notificationsService.create({
      title: 'New Operation Location Created',
      message: `A new operation location has been successfully created, Operation Location ID: {id-link}, ${location.name}`,
      type: NotificationType.OperationLocation,
      data: { id: location.id },
    });

    return location;
  }

  @Get()
  findAll() {
    return this.operationLocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationLocationService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateOperationLocationDto: UpdateOperationLocationDto,
  ) {
    const location = await this.operationLocationService.update(
      id,
      updateOperationLocationDto,
    );

    await this.notificationsService.create({
      title: 'New Operation Location Updated',
      message: `A new operation location has been successfully updated, Operation Location ID: {id-link}, ${location.name}`,
      type: NotificationType.OperationLocation,
      data: { id: location.id },
    });

    return location;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const location = await this.operationLocationService.remove(id);

    await this.notificationsService.create({
      title: 'New Operation Location Deleted',
      message: `A new operation location has been successfully deleted, Operation Location ID: {id-bold}, ${location.name}`,
      type: NotificationType.OperationLocation,
      data: { id: location.id },
    });

    return location;
  }
}
