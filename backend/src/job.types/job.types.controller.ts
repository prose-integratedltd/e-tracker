import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { JobTypesService } from './job.types.service';
import { CreateJobTypeDto } from './dto/create-job.type.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/users/roles/role.decorator';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('job-types')
@UseGuards(AuthGuard, RolesGuard)
export class JobTypesController {
  constructor(private readonly service: JobTypesService) {}

  @Post()
  @Roles(Role.admin)
  @UsePipes(ValidationPipe)
  async create(@Body() createJobTypeDto: CreateJobTypeDto) {
    const type = await this.service.findOneByName(createJobTypeDto.name);

    if (type) throw new ConflictException('Job type already exists');

    const $type = await this.service.create(createJobTypeDto);

    return $type;
  }

  @Get()
  @Roles(Role.admin, Role.user)
  async findAll() {
    const types = await this.service.findAll();

    return types;
  }

  @Get(':id')
  @Roles(Role.admin, Role.user)
  async findOne(@Param('id') id: string) {
    const type = await this.service.findOne(id);
    if (!type) throw new NotFoundException('Job type not found');

    return type;
  }
  /* 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobTypeDto: UpdateJobTypeDto) {
    return this.service.update(+id, updateJobTypeDto);
  } */

  @Delete(':id')
  @Roles(Role.admin)
  async remove(@Param('id') id: string) {
    const type = await this.service.findOne(id);
    if (!type) throw new NotFoundException('Job type not found');

    return this.service.remove(id);
  }
}
