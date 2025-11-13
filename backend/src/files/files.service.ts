import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ExtractedImage } from 'src/email/types/extracted.image';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaClient) {}

  create(file: Express.Multer.File) {
    return this.prisma.file.create({
      data: {
        filename: this.generateFilename(file.originalname),
        mimetype: file.mimetype,
        size: file.size,
        data: new Uint8Array(file.buffer),
      },

      select: { filename: true, mimetype: true },
    });
  }

  // uploadBase64Image(image: ExtractedImage) {
  //   return this.prisma.file.create({
  //     data: {
  //       filename: this.generateFilename(image.src),
  //       mimetype: image.mimetype,
  //       size: image.size,
  //       data: image.buffer,
  //     },

  //     select: { filename: true, mimetype: true },
  //   });
  // }

  uploadBase64Image(image: ExtractedImage) {
    return this.prisma.file.create({
      data: {
        filename: this.generateFilename(image.src),
        data: new Uint8Array(image.buffer),
        mimetype: image.mimetype,
        size: image.size,
      },
 
      select: { filename: true, mimetype: true },
    });
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(filename: string) {
    return this.prisma.file.findUnique({ where: { filename } });
  }

  private generateFilename(originalname: string): string {
    return `${Date.now()}-${originalname}`.replaceAll(' ', '-').toLowerCase();
  }
}
