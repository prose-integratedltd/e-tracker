import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { PrismaClient } from '@prisma/client';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = await this.findByName(createDepartmentDto.name);

    if (department) throw new ConflictException('Department already exist');

    return this.prisma.department.create({ data: createDepartmentDto });
  }

  findAll() {
    return this.prisma.department.findMany();
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) throw new NotFoundException('Department not found');

    return department;
  }

  findByName(name: string) {
    return this.prisma.department.findUnique({ where: { name } });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.findOne(id);

    if (!department) throw new NotFoundException('Department not found');

    return this.prisma.department.update({
      data: updateDepartmentDto,
      where: { id },
    });
  }

  async remove(id: string) {
    const department = await this.findOne(id);

    if (!department) throw new NotFoundException('Department not found');

    return this.prisma.department.delete({ where: { id } });
  }
}
