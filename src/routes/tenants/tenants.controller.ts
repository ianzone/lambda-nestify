import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InternalGuard } from 'src/guards';
import { ContextService } from 'src/services';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(InternalGuard)
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly ctx: ContextService,
    private readonly tenantsService: TenantsService
  ) {}

  @Post()
  create(@Body() body: CreateTenantDto) {
    return this.tenantsService.create(body);
  }

  @Put()
  overwrite(@Body() body: CreateTenantDto) {
    return this.tenantsService.overwrite(body);
  }

  @Head(':id') // NOTE - The Head method must be defined before the Get method
  checkOne(@Param('id') id: string) {
    if (this.ctx.tenant.id === id) {
      return this.ctx.tenant;
    }
    return this.tenantsService.checkOne(id);
  }

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (this.ctx.tenant.id === id) {
      return this.ctx.tenant;
    }
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
