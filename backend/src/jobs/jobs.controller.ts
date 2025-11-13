import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobTypesService } from 'src/job.types/job.types.service';
import { Roles } from 'src/users/roles/role.decorator';
import { NotificationType, Role } from '@prisma/client';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDTO } from './dto/query-job.dto';
import formatDate from 'src/date.format';
import { CreateCarHireJob } from './dto/create-car-hire-job.dto';
import { CreateCustomClearanceJob } from './dto/create-custom-clearance-job.dto';
import { CreatePackingAndMovingJob } from './dto/create-packing-and-moving-job.dto';
import { CreateTransportationJob } from './dto/create-transportation-job.dto';
import { CreateWarehouseJob } from './dto/create-warehouse-job.dto';
import { UpdateCarHireJob } from './dto/update-car-hire-job.dto';
import { UpdateWarehouseJob } from './dto/update-warehouse-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly service: JobsService,
    private readonly typeService: JobTypesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async create(@Body() createJobDto: CreateJobDto, @Request() request) {
    const type = await this.typeService.findOne(createJobDto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.create(createJobDto);

    await this.notificationsService.create({
      title: 'New Job Created',
      message: `Job ID: {id-link}, Created by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))} - ${job.description}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Post('car-hire')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async createCarHire(@Body() dto: CreateCarHireJob, @Request() request) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.createCarHire(dto);

    await this.notificationsService.create({
      title: 'New Car Hire Job Created',
      message: `Job ID: {id-link}, Created by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Post('warehouse')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async createWarehouse(@Body() dto: CreateWarehouseJob, @Request() request) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.createWarehouse(dto);

    await this.notificationsService.create({
      title: 'New Warehouse Job Created',
      message: `Job ID: {id-link}, Created by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Post('custom-clearance')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async createCustomClearance(
    @Body() dto: CreateCustomClearanceJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.createCustomClearance(dto);

    await this.notificationsService.create({
      title: 'New Custom Clearance Job Created',
      message: `Job ID: {id-link}, Created by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Post('packing-and-moving')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async createPackingAndMoving(
    @Body() dto: CreatePackingAndMovingJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.createPackingAndMoving(dto);

    await this.notificationsService.create({
      title: 'New Packing & Moving Job Created',
      message: `Job ID: {id-link}, Created by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Post('transportation')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  async createTransportation(
    @Body() dto: CreateTransportationJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.createTransportation(dto);

    await this.notificationsService.create({
      title: 'New Transportation Job Created',
      message: `Job ID: {id-link}, Created by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Patch('car-hire/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  async updateCarHire(
    @Param('id') id: string,
    @Body() dto: UpdateCarHireJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.updateCarHire(id, dto);

    await this.notificationsService.create({
      title: 'Update Car Hire Job',
      message: `Job ID: {id-link}, Updated by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Patch('warehouse/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  async updateWarehouse(
    @Param('id') id: string,
    @Body() dto: UpdateWarehouseJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.updateWarehouse(id, dto);

    await this.notificationsService.create({
      title: 'Warehouse Job Updated',
      message: `Job ID: {id-link}, Updated by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Patch('custom-clearance/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async updateCustomClearance(
    @Param('id') id: string,
    @Body() dto: CreateCustomClearanceJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.updateCustomClearance(id, dto);

    await this.notificationsService.create({
      title: 'Custom Clearance Job Updated',
      message: `Job ID: {id-link}, Updated by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Patch('packing-and-moving/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async updatePackingAndMoving(
    @Param('id') id: string,
    @Body() dto: CreatePackingAndMovingJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.updatePackingAndMoving(id, dto);

    await this.notificationsService.create({
      title: 'New Packing & Moving Job Updated',
      message: `Job ID: {id-link}, Updated by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Patch('transportation/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async updateTransportation(
    @Param('id') id: string,
    @Body() dto: CreateTransportationJob,
    @Request() request,
  ) {
    const type = await this.typeService.findOne(dto.typeId);
    if (!type) throw new Error('Job Type not found');

    const job = await this.service.updateTransportation(id, dto);

    await this.notificationsService.create({
      title: 'New Transportation Job Updated',
      message: `Job ID: {id-link}, Updated by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  findAll(@Query() query: QueryJobDTO) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('/track/:id')
  findOneByTrackingId(@Param('id') jId: string) {
    return this.service.findOneByTrackingId(jId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() request,
  ) {
    const job = await this.service.update(id, updateJobDto);

    await this.notificationsService.create({
      title: 'Job Updated',
      message: `Job ID: {id-link}, Updated by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))} - ${job.description}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  @UsePipes(ValidationPipe)
  async remove(@Param('id') id: string, @Request() request) {
    const job = await this.service.remove(id);

    await this.notificationsService.create({
      title: 'Job Deleted',
      // message: 'A job has been successfully deleted, Job ID: {id-link}',
      message: `Job ID: {id-link}, Deleted by ${request['user']['fullname']} on ${formatDate(new Date(Date.now()))} - ${job.description}`,
      type: NotificationType.Job,
      data: { id: job.id, jId: job.jId },
      userId: request['user']['id'],
    });

    return job;
  }

  @Get('/get/types')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  async findJobTypes() {
    return await this.service.findJobTypes();
  }

  @Get('/get/types/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.user)
  async findJobType(@Param('id') id: string) {
    return await this.service.findJobType(id);
  }
}
