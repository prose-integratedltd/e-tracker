import { CreatePackingAndMovingJob } from './dto/create-packing-and-moving-job.dto';
import { CreateCustomClearanceJob } from './dto/create-custom-clearance-job.dto';
import { UpdateCustomClearanceJob } from './dto/update-custom-clearance-job.dto';
import { CreateTransportationJob } from './dto/create-transportation-job.dto';
import { UpdateTransportationJob } from './dto/update-transportation-job.dto';
import { CreateWarehouseJob } from './dto/create-warehouse-job.dto';
import { UpdateWarehouseJob } from './dto/update-warehouse-job.dto';
import { CreateCarHireJob } from './dto/create-car-hire-job.dto';
import { UpdateCarHireJob } from './dto/update-car-hire-job.dto';
import { $Enums, JobStatus, PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { generateId } from 'src/helper/id.generator';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDTO } from './dto/query-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createJobDto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
        jId: generateId(createJobDto.clientName),
      },
    });

    return job;
  }

  async createCarHire(dto: CreateCarHireJob) {
    const job = await this.prisma.jobModel.create({
      data: {
        ...dto,
        jId: generateId(dto.clientName),
        pickupLocation: dto.pickupLocation?.toObject(),
        dropOffLocation: dto.dropOffLocation?.toObject(),
      },
    });

    return job;
  }

  async createCustomClearance(dto: CreateCustomClearanceJob) {
    const job = await this.prisma.jobModel.create({
      data: {
        ...dto,
        jId: generateId(dto.clientName),
      },
    });

    return job;
  }

  async createPackingAndMoving(dto: CreatePackingAndMovingJob) {
    const job = await this.prisma.jobModel.create({
      data: {
        ...dto,
        jId: generateId(dto.clientName),
        moreLocations: dto.moreLocations?.toObject(),
        packingLocation: dto.packingLocation?.toObject(),
        deliveryLocation: dto.deliveryLocation?.toObject(),
      },
    });

    return job;
  }

  async createTransportation(dto: CreateTransportationJob) {
    const job = await this.prisma.jobModel.create({
      data: {
        ...dto,
        jId: generateId(dto.clientName),
        moreLocations: dto.moreLocations?.toObject(),
        pickupLocation: dto.pickupLocation?.toObject(),
        deliveryLocation: dto.deliveryLocation?.toObject(),
      },
    });

    return job;
  }

  async createWarehouse(dto: CreateWarehouseJob) {
    const job = await this.prisma.jobModel.create({
      data: {
        ...dto,
        jId: generateId(dto.clientName),
      },
    });

    return job;
  }

  async updateCarHire(id: string, dto: UpdateCarHireJob) {
    const job = await this.prisma.jobModel.update({
      data: {
        ...dto,
        updatedAt: new Date(),
        pickupLocation: dto.pickupLocation?.toObject(),
        dropOffLocation: dto.pickupLocation?.toObject(),
      },
      where: { id },
    });

    return job;
  }

  async updateCustomClearance(id: string, dto: UpdateCustomClearanceJob) {
    const job = await this.prisma.jobModel.update({
      data: { ...dto, updatedAt: new Date() },
      where: { id },
    });

    return job;
  }

  async updatePackingAndMoving(id: string, dto: CreatePackingAndMovingJob) {
    const job = await this.prisma.jobModel.update({
      data: {
        ...dto,
        updatedAt: new Date(),
        moreLocations: dto.moreLocations?.toObject(),
        packingLocation: dto.packingLocation?.toObject(),
        deliveryLocation: dto.deliveryLocation?.toObject(),
      },
      where: { id },
    });

    return job;
  }

  async updateTransportation(id: string, dto: UpdateTransportationJob) {
    return this.prisma.jobModel.update({
      data: {
        ...dto,
        moreLocations: dto.moreLocations?.toObject(),
        pickupLocation: dto.pickupLocation?.toObject(),
        deliveryLocation: dto.deliveryLocation?.toObject(),
        updatedAt: new Date(),
      },
      where: { id },
    });
  }

  async updateWarehouse(id: string, dto: UpdateWarehouseJob) {
    return this.prisma.jobModel.update({
      data: { ...dto, updatedAt: new Date() },
      where: { id },
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.prisma.job.update({
      data: updateJobDto,
      where: { id },
    });

    return job;
  }

  async findAll({
    page,
    limit: take,
    sortBy,
    sortOrder,
    status,
    typeId,
    typeName,
    progress,
    search,
    startDate,
    endDate,
  }: QueryJobDTO) {
    const skip = (page - 1) * take;

    const [data, numberOfJobs] = await Promise.all([
      this.prisma.jobModel.findMany({
        skip,
        take,
        select: {
          id: true,
          jId: true,
          date: true,
          type: true,
          status: true,
          clientName: true,
          description: true,
          statusUpdates: {
            select: { completed: true },
          },
          createdAt: true,
        },
        where: {
          status,
          ...(typeId && {
            type: {
              OR: [{ id: { contains: typeId, mode: 'insensitive' } }],
            },
          }),
          ...(typeName && {
            type: {
              OR: [{ name: { contains: typeName, mode: 'insensitive' } }],
            },
          }),
          ...(search && {
            OR: [
              { jId: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { clientName: { contains: search, mode: 'insensitive' } },
            ],
          }),
          ...(startDate &&
            endDate && {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            }),
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.jobModel.count(),
    ]);

    const jobs = data.map((job) => ({
      ...job,
      progress: this.getProgress(job),
    }));

    const totalPages = Math.ceil(numberOfJobs / take);

    return {
      data: progress ? jobs.filter((job) => job.progress == progress) : jobs,
      numberOfJobs,
      page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages,
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.jobModel.findUnique({
      where: { id },
      include: { type: true },
    });

    if (!job) throw new NotFoundException('Job not found');

    return job;
  }

  async findOneByTrackingId(jId: string) {
    const job = await this.prisma.jobModel.findUnique({
      where: { jId },
      select: { id: true, status: true, statusUpdates: true },
    });

    if (!job) throw new NotFoundException('Job not found');

    return { ...job, progress: this.getProgress(job) };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.jobModel.delete({ where: { id } });
  }

  findJobTypes() {
    return this.prisma.jobModelType.findMany();
  }

  findJobType(id: string) {
    return this.prisma.jobModelType.findUnique({ where: { id } });
  }

  private getProgress(job: {
    status: $Enums.JobStatus;
    statusUpdates: { completed: boolean }[];
  }) {
    const items: boolean[] = job.statusUpdates.map((item) => item.completed);
    const total = items.length;
    const trueCount = items.filter((item) => item).length;
    const percentage = (trueCount / total) * 100;
    const result = Number(percentage.toFixed(1));

    if (job.status === JobStatus.Completed) return 100;

    return Number.isNaN(result) ? 0 : result;
  }
}
