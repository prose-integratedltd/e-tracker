import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { Roles } from 'src/users/roles/role.decorator';
import { Role } from '@prisma/client';

@Controller('statistics')
@Roles(Role.admin, Role.user)
@UseGuards(AuthGuard, RolesGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }
}
