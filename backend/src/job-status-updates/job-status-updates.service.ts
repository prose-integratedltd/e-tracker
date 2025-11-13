import { Injectable } from '@nestjs/common';
import { CreateJobStatusUpdateDto } from './dto/create-job-status-update.dto';
import { PrismaClient } from '@prisma/client';
import { QueryJobStatusUpdateDTO } from './dto/query-job.status.update.dto';
import { UpdateJobStatusUpdateDto } from './dto/update-job-status-update.dto';

@Injectable()
export class JobStatusUpdatesService {
  constructor(private readonly prisma: PrismaClient) {}

  create(createJobStatusUpdateDto: CreateJobStatusUpdateDto) {
    return this.prisma.jobModelStatusUpdate.create({
      data: {
        ...createJobStatusUpdateDto,
        time: createJobStatusUpdateDto.time ?? createJobStatusUpdateDto.date,
        location: createJobStatusUpdateDto.location?.toObject(),
      },
    });
  }

  async findAll({
    jobId,
    trackingId,
    page,
    limit: take,
    sortBy,
    sortOrder,
  }: QueryJobStatusUpdateDTO) {
    const skip = (page - 1) * take;

    const [statuses, numberOfStatuses] = await Promise.all([
      this.prisma.jobModelStatusUpdate.findMany({
        skip,
        take,
        where: { OR: [{ job: { jId: trackingId } }, { jobId }] },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.jobModelStatusUpdate.count({
        where: { OR: [{ job: { jId: trackingId } }, { jobId }] },
      }),
    ]);

    const totalPages = Math.ceil(numberOfStatuses / take);

    return {
      data: statuses,
      numberOfStatuses,
      page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages,
    };
  }

  findOne(id: string) {
    return this.prisma.jobModelStatusUpdate.findUnique({ where: { id } });
  }

  update(id: string, updateJobStatusUpdateDto: UpdateJobStatusUpdateDto) {
    return this.prisma.jobModelStatusUpdate.update({
      data: updateJobStatusUpdateDto,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.jobModelStatusUpdate.delete({ where: { id } });
  }
}
