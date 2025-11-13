import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { PrismaClient } from '@prisma/client';
import { QueryEmailTemplateDTO } from './dto/query.email.template.dto';

@Injectable()
export class EmailTemplatesService {
  constructor(private readonly prisma: PrismaClient) {}

  create(createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.prisma.emailTemplate.create({
      data: createEmailTemplateDto,
    });
  }

  async findAll(query: QueryEmailTemplateDTO) {
    const { page, limit: take, type, search, sortOrder, sortBy } = query;

    const skip = (page - 1) * take;

    const [data, numberOfTemplates] = await Promise.all([
      this.prisma.emailTemplate.findMany({
        skip,
        take,
        select: {
          id: true,
          type: true,
          title: true,
          createdAt: true,
        },
        where: {
          type,
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { subject: { contains: search, mode: 'insensitive' } },
              { body: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.emailTemplate.count(),
    ]);

    const totalPages = Math.ceil(numberOfTemplates / take);

    return {
      data,
      numberOfTemplates,
      page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages,
    };
  }

  async findOne(id: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) throw new NotFoundException('Template not found');

    return template;
  }

  async update(id: string, updateEmailTemplateDto: UpdateEmailTemplateDto) {
    await this.findOne(id);

    return this.prisma.emailTemplate.update({
      where: { id },
      data: updateEmailTemplateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.emailTemplate.delete({ where: { id } });
  }
}
