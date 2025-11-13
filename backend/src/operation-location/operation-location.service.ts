import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOperationLocationDto } from './dto/create-operation-location.dto';
import { UpdateOperationLocationDto } from './dto/update-operation-location.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class OperationLocationService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createOperationLocationDto: CreateOperationLocationDto) {
    const location = await this.findByName(createOperationLocationDto.name);

    if (location)
      throw new ConflictException('Operation location already exist');

    return this.prisma.operationLocation.create({
      data: createOperationLocationDto,
    });
  }

  findAll() {
    return this.prisma.operationLocation.findMany();
  }

  async findOne(id: string) {
    const location = await this.prisma.operationLocation.findUnique({
      where: { id },
    });

    if (!location) throw new NotFoundException();

    return location;
  }

  findByName(name: string) {
    return this.prisma.operationLocation.findUnique({
      where: { name },
    });

    return location;
  }

  async update(
    id: string,
    updateOperationLocationDto: UpdateOperationLocationDto,
  ) {
    const location = await this.findOne(id);

    if (location)
      throw new ConflictException('Operation location already exist');

    return this.prisma.operationLocation.update({
      data: updateOperationLocationDto,
      where: { id },
    });
  }

  async remove(id: string) {
    const location = await this.findOne(id);

    if (!location) throw new NotFoundException('Operation not found');

    return this.prisma.operationLocation.delete({ where: { id } });
  }
}
