import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient, Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { SigninUserDto } from './dto/signin-user.dto.ts';
import { generateId } from 'src/helper/id.generator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindWhereDto } from './dto/find.where.dto';
import { SelectUser } from './dto/select.user';
import { QueryUserDTO } from './dto/query.user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id }, { uId: id }],
      },
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

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        roles: true,
        suspended: true,
        fullname: true,
      },
    });
  }

  findWhere(findWhereDto: FindWhereDto, select?: SelectUser) {
    return this.prisma.user.findUnique({
      where: findWhereDto,
      select: select,
    });
  }

  findOneByUID(uId: string): any {
    return this.prisma.user.findUnique({
      where: { uId },
      select: { id: true },
    });
  }

  findOneByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const [department, location] = await Promise.all([
      this.prisma.department.findUnique({
        where: { id: createUserDto.departmentId },
        select: { id: true },
      }),
      this.prisma.operationLocation.findUnique({
        where: { id: createUserDto.operationLocationId },
        select: { id: true },
      }),
    ]);

    if (!department) throw new BadRequestException('Invalid department ID');
    if (!location)
      throw new BadRequestException('Invalid operation location ID');

    const password = await hash(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
        uId: generateId(createUserDto.fullname),
      },
      select: {
        id: true,
        uId: true,
        profilePicture: true,
        departmentId: false,
        operationLocationId: false,
        username: true,
        email: true,
        fullname: true,
        phoneNumber: true,
        password: false,
        roles: false,
        updatedAt: false,
        createdAt: false,
      },
    });

    return user;
  }

  async authenticate({ email, password }: SigninUserDto) {
    const user = await this.findOneByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const roles = user.roles;
    if (!(roles.includes(Role.admin) || roles.includes(Role.user))) {
      throw new UnauthorizedException(
        'You need to be an admin to access this dashboard',
      );
    }

    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    const verified = await verify(user.password, password);

    if (!verified) throw new UnauthorizedException('Invalid credentials');

    if (user.suspended) {
      throw new UnauthorizedException('Your account has been suspended');
    }

    return {
      isAdmin: user.roles.includes(Role.admin),
      roles: user.roles,
      accessToken: await this.jwtService.signAsync(
        { id: user.id, email, roles: user.roles, fullname: user.fullname },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1h',
        },
      ),
    };
  }

  async findAll(query: QueryUserDTO) {
    const { page, limit: take, search, role, sortOrder, sortBy } = query;

    const skip = (page - 1) * take;

    const [data, numberOfUsers] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          uId: true,
          username: true,
          email: true,
          fullname: true,
          phoneNumber: true,
          suspended: true,
        },
        where: {
          roles: role ? { has: role } : { hasSome: [Role.admin, Role.user] },
          ...(search && {
            OR: [
              { uId: { contains: search, mode: 'insensitive' } },
              { fullname: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { username: { contains: search, mode: 'insensitive' } },
              { phoneNumber: { contains: search, mode: 'insensitive' } },
              {
                department: { name: { contains: search, mode: 'insensitive' } },
              },
              {
                operationLocation: {
                  name: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }),
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(numberOfUsers / take);

    return {
      data,
      numberOfUsers,
      page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
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
        operationLocation: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const [department, location] = await Promise.all([
      this.findDepartment(updateUserDto.departmentId),
      this.findOperationLocation(updateUserDto.operationLocationId),
    ]);

    if (updateUserDto.departmentId && !department)
      throw new BadRequestException('Invalid department ID');

    if (updateUserDto.operationLocationId && !location)
      throw new BadRequestException('Invalid operation location ID');

    const select = {
      id: true,
      uId: true,
      departmentId: true,
      operationLocationId: true,
      username: true,
      email: true,
      fullname: true,
      phoneNumber: true,
      profilePicture: true,
      department: true,
      operationLocation: true,
      password: false,
      roles: true,
      suspended: true,
      updatedAt: true,
      createdAt: true,
    };

    if (updateUserDto.password) {
      const password = await hash(updateUserDto.password);

      return this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto, password },
        select,
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        roles: updateUserDto.roles,
        fullname: updateUserDto.fullname,
        suspended: updateUserDto.suspended,
        phoneNumber: updateUserDto.phoneNumber,
        departmentId: updateUserDto.departmentId,
        profilePicture: updateUserDto.profilePicture,
        operationLocationId: updateUserDto.operationLocationId,
      },
      select,
    });
  }

  private findDepartment(departmentId?: string): any {
    if (!departmentId) return;

    return this.prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });
  }

  private findOperationLocation(operationLocationId?: string): any {
    if (!operationLocationId) return;

    return this.prisma.operationLocation.findUnique({
      where: { id: operationLocationId },
      select: { id: true },
    });
  }
}
