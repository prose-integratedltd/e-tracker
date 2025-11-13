import { PrismaService } from './prisma/prisma.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { OperationLocationModule } from './operation-location/operation-location.module';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { JobTypesModule } from './job.types/job.types.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StatisticsModule } from './statistics/statistics.module';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { JobStatusUpdatesModule } from './job-status-updates/job-status-updates.module';
import { EmailModule } from './email/email.module';
import { GooglePlacesModule } from './google-places/google-places.module';
import { JobReviewsModule } from './job-reviews/job-reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.staging'],
      isGlobal: true,
    }),
    DepartmentModule,
    OperationLocationModule,
    JobsModule,
    UsersModule,
    JobTypesModule,
    NotificationsModule,
    StatisticsModule,
    EmailTemplatesModule,
    AuthModule,
    FilesModule,
    JobStatusUpdatesModule,
    EmailModule,
    GooglePlacesModule,
    JobReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
