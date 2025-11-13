import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import * as nodemailer from 'nodemailer';
import { FilesService } from 'src/files/files.service';
import { ExtractedImage } from './types/extracted.image';
import { Jimp, JimpMime } from 'jimp';

@Injectable()
export class EmailService {
  constructor(private readonly filesService: FilesService) {}

  private baseUrl = process.env.BASE_URL;

  private transporter = nodemailer.createTransport({
    name: 'Prose',
    host: 'smtp.hostinger.com', // e.g., smtp.gmail.com for Gmail
    port: 465, // or 465 for secure connection
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD, // App password
    },
  });

  async send({
    to,
    subject,
    textBody,
    htmlBody,
    attachments: $attachments = [],
  }: SendEmailDto) {
    try {
      const attachments = await Promise.all(
        ($attachments ?? []).map(async (attachment) => {
          const filepath = `${this.baseUrl}${attachment['filename']}`;
          console.log('File path', filepath);

          const filename = (attachment['filename'] as string).replace(
            '/files/',
            '',
          );

          return {
            filename: filename as string,
            contentType: attachment['mimetype'] as string,
            href: filepath,
          };
        }),
      );

      const updatedHtml = await this.processHtmlAndSaveImages(htmlBody);

      await this.transporter.sendMail({
        from: `"Prose" ${process.env.EMAIL_USER}`,
        to,
        subject,
        text: textBody,
        html: updatedHtml,
        attachments: attachments,
      });

      return { message: 'Email sent successfully', updatedHtml };
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  private async processHtmlAndSaveImages(htmlBody: string): Promise<string> {
    const imgTagRegex =
      /<img[^>]+src="data:image\/([a-zA-Z0-9]+);base64,([^"]+)"/g;

    let updatedHtml = htmlBody;

    let match;
    while ((match = imgTagRegex.exec(htmlBody)) !== null) {
      const extension = match[1]; // Extract the image format
      const base64Data = match[2]; // Extract base64 content

      const buffer = await this.compressImage(base64Data);

      if (!extension) {
        console.error('❌ Extension is undefined for image:', match[0]);
        continue;
      }

      const { filename } = await this.filesService.uploadBase64Image({
        base64Image: `data:image/${extension};base64,${base64Data}`,
        src: `email-image-${Date.now()}.${extension}`,
        buffer: buffer,
        mimetype: `image/${extension}`,
        size: buffer.length,
      });

      console.log('Image tag', `<img src="${this.baseUrl}/files/${filename}"`);

      updatedHtml = updatedHtml.replace(
        match[0],
        `<img src="${this.baseUrl}/files/${filename}"`,
      );
    }

    return updatedHtml;
  }

  private async compressImage(base64Data: string): Promise<Buffer> {
    const image = await Jimp.read(Buffer.from(base64Data, 'base64'));

    return image.getBuffer(JimpMime.jpeg, { quality: 80 });
  }

  private async extractImagesFromHtml(
    htmlBody: string,
  ): Promise<ExtractedImage[]> {
    const images: ExtractedImage[] = [];

    const imgTagRegex = /<img[^>]+src="(data:image\/([^;]+);base64,([^"]+))"/g;

    let match;
    while ((match = imgTagRegex.exec(htmlBody)) !== null) {
      const base64Data = match[3];
      const extension = match[2];
      // const extension = mimeType.split('/')[1];

      const buffer = (await this.compressImage(base64Data)) as Buffer;

      images.push({
        base64Image: `data:image/${extension};base64,${base64Data}`,
        src: `email-image-${Date.now()}.${extension}`,
        buffer: buffer,
        mimetype: `image/${extension}`,
        size: buffer.length,
      });
    }

    return images;
  }

  /* 
  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  } */
}
