import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        departmentId: false,
        operationLocationId: false,
        uId: true,
        username: true,
        email: true,
        fullname: true,
        phoneNumber: true,
        password: false,
        department: true,
        profilePicture: true,
        operationLocation: true,
        roles: true,
        suspended: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
