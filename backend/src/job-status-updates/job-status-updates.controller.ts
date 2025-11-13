import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { JobStatusUpdatesService } from './job-status-updates.service';
import { CreateJobStatusUpdateDto } from './dto/create-job-status-update.dto';
import { QueryJobStatusUpdateDTO } from './dto/query-job.status.update.dto';
import { UpdateJobStatusUpdateDto } from './dto/update-job-status-update.dto';

@Controller('job-status-updates')
export class JobStatusUpdatesController {
  constructor(
    private readonly jobStatusUpdatesService: JobStatusUpdatesService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createJobStatusUpdateDto: CreateJobStatusUpdateDto) {
    return this.jobStatusUpdatesService.create(createJobStatusUpdateDto);
  }

  @Get()
  findAll(@Query() query: QueryJobStatusUpdateDTO) {
    return this.jobStatusUpdatesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobStatusUpdatesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobStatusUpdateDto: UpdateJobStatusUpdateDto,
  ) {
    return this.jobStatusUpdatesService.update(id, updateJobStatusUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobStatusUpdatesService.remove(id);
  }
}
