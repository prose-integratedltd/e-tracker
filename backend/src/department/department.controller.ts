import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  Patch,
  Delete,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentService.create(createDepartmentDto);

    await this.notificationsService.create({
      title: 'Department Created',
      message:
        'Department has been successfully created, Department ID {id-link}',
      type: NotificationType.Department,
      data: { id: department.id },
    });

    return department;
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    const department = await this.departmentService.update(
      id,
      updateDepartmentDto,
    );

    await this.notificationsService.create({
      title: 'Department Updated',
      message:
        'Department has been successfully updated, Department ID {id-link}',
      type: NotificationType.Department,
      data: { id: department.id },
    });

    return department;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const department = await this.departmentService.remove(id);

    await this.notificationsService.create({
      title: 'Department Deleted',
      message:
        'Department has been successfully deleted, Department ID {id-bold}',
      type: NotificationType.Department,
      data: { id: department.id },
    });

    return department;
  }
}
