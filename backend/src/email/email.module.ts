import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { FilesModule } from 'src/files/files.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [FilesModule, UsersModule],
  controllers: [EmailController],
  providers: [EmailService, JwtService],
})
export class EmailModule {}
