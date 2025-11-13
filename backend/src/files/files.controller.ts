import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png|pdf/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1048576,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const uploadedFile = await this.filesService.create(file);

    return {
      ...uploadedFile,
      filename: `/files/${uploadedFile.filename}`,
    };
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const file = await this.filesService.findOne(id);

    if (!file) throw new NotFoundException('File not found');

    response.setHeader('Content-Type', file.mimetype);
    response.end(file.data);
  }
}
