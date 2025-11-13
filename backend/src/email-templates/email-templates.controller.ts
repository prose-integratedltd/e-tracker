import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
  Request,
} from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { Roles } from 'src/users/roles/role.decorator';
import { NotificationType, Role } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { QueryEmailTemplateDTO } from './dto/query.email.template.dto';

@Controller('email-templates')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.admin, Role.user)
export class EmailTemplatesController {
  constructor(
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createEmailTemplateDto: CreateEmailTemplateDto,
    @Request() request,
  ) {
    const template = await this.emailTemplatesService.create(
      createEmailTemplateDto,
    );

    await this.notificationService.create({
      title: `${template.type} Template Created`,
      message: `${template.type} template has been successfully created, template ID {id-link}`,
      type: NotificationType.EmailTemplate,
      userId: request['user']['id'],
      data: { id: template.id },
    });

    return template;
  }

  @Get()
  findAll(@Query() query: QueryEmailTemplateDTO) {
    return this.emailTemplatesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const template = await this.emailTemplatesService.findOne(id);

    if (!template) throw new NotFoundException();

    return template;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
    @Request() request,
  ) {
    const template = await this.emailTemplatesService.update(
      id,
      updateEmailTemplateDto,
    );

    await this.notificationService.create({
      title: `${template.type} Template Updated`,
      message: `${template.type} template has been successfully updated, template ID {id-link}`,
      type: NotificationType.EmailTemplate,
      userId: request['user']['id'],
      data: { id: template.id },
    });

    return template;
  }

  @Delete(':id')
  @Roles(Role.admin)
  async remove(@Param('id') id: string, @Request() request) {
    const template = await this.emailTemplatesService.remove(id);

    await this.notificationService.create({
      title: `${template.type} Template Deleted`,
      message: `${template.type} template has been successfully deleted, template ID {id-link}`,
      type: NotificationType.EmailTemplate,
      userId: request['user']['id'],
      data: { id: template.id },
    });

    return template;
  }
}
