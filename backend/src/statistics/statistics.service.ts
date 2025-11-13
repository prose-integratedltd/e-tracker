import { Injectable } from '@nestjs/common';
import { JobStatus, PrismaClient } from '@prisma/client';

type JobStatistics = {
  year: number;
  month: number;
  startDate: Date;
  endDate: Date;
  count: number;
};

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    const [totalJobs, completedJobs, activeJobs, cancelledJobs, chart] =
      await Promise.all([
        this.prisma.jobModel.count(),
        this.prisma.jobModel.count({ where: { status: JobStatus.Completed } }),
        this.prisma.jobModel.count({
          where: {
            NOT: { status: { in: [JobStatus.Completed, JobStatus.Cancelled] } },
          },
        }),
        this.prisma.jobModel.count({ where: { status: JobStatus.Cancelled } }),
        this.getChart(),
      ]);

    return {
      totalJobs,
      completedJobs,
      activeJobs,
      cancelledJobs,
      chart,
    };
  }

  private async getChart() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const result = await this.prisma.$queryRaw<JobStatistics[]>`
          SELECT
            EXTRACT(YEAR FROM "createdAt") AS year,
            EXTRACT(MONTH FROM "createdAt") AS month,
            MIN("createdAt") AS "startDate",
            MAX("createdAt") AS "endDate",
            COUNT(*) AS count
          FROM jobs_model
          GROUP BY year, month
          ORDER BY year, month
          LIMIT 12;
        `;

    return result.reduce((acc, row) => {
      const year = row.year.toString();
      const monthName = months[row.month - 1];

      if (!acc[year]) acc[year] = {};
      acc[year][monthName] = {
        startDate: row.startDate,
        endDate: row.endDate,
        count: Number(row.count),
      };

      return acc;
    }, {});
  }
}
