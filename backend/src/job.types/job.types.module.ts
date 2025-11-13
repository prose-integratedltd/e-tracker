import { Module } from '@nestjs/common';
import { JobTypesService } from './job.types.service';
import { JobTypesController } from './job.types.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [JobTypesController],
  providers: [JobTypesService, PrismaClient, JwtService, UsersService],
})
export class JobTypesModule {}
