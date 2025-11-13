import { Injectable } from '@nestjs/common';
import { CreateJobTypeDto } from './dto/create-job.type.dto';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class JobTypesService {
  constructor(private readonly prisma: PrismaClient) {}

  create(createJobTypeDto: CreateJobTypeDto) {
    return this.prisma.jobModelType.create({ data: createJobTypeDto });
  }

  findAll() {
    return this.prisma.jobModelType.findMany();
  }

  findOne(id: string) {
    return this.prisma.jobModelType.findFirstOrThrow({ where: { id } });
  }

  findOneByName(name: string) {
    return this.prisma.jobModelType.findUnique({ where: { name } });
  }

  /* update(id: number, updateJobTypeDto: UpdateJobTypeDto) {
    return updateJobTypeDto;
  } */

  remove(id: string) {
    return this.prisma.jobModelType.delete({ where: { id } });
  }
}
