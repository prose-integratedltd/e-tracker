import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaClient } from '@prisma/client';
import { QueryNotificationDTO } from './dto/query-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaClient) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async findAll(
    { page, limit: take, sortBy, sortOrder, search }: QueryNotificationDTO,
    isAdmin = false,
    userId?: string,
  ) {
    const skip = (page - 1) * take;

    const [data, numberOfNotification] = await Promise.all([
      this.prisma.notification.findMany({
        skip,
        take,
        where: {
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { message: { contains: search, mode: 'insensitive' } },
            ],
          }),
          ...(!isAdmin && { userId: userId }),
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.job.count(),
    ]);

    const totalPages = Math.ceil(numberOfNotification / take);

    return {
      data,
      numberOfNotification,
      page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages,
    };
  }

  async clear(isAdmin: boolean = false, userId?: string) {
    await this.prisma.notification.deleteMany({
      where: {
        ...(!isAdmin && { userId: userId }),
      },
    });

    return;
  }

  async markAsSeen(ids: string[]) {
    return await this.prisma.notification.updateMany({
      data: { seen: true },
      where: { id: { in: ids } },
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
