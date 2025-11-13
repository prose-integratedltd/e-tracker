import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  exports: [FilesService],
  controllers: [FilesController],
  providers: [FilesService, PrismaClient],
})
export class FilesModule {}
