import { Body, Controller, Delete, Get, Head, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { ContextService } from 'src/services';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourcesService } from './resources.service';

@ApiTags('Resources')
@ApiOAuth2([])
@ApiBearerAuth()
@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly ctx: ContextService,
    private readonly resourcesService: ResourcesService
  ) {}

  @Post()
  create(@Body() body: CreateResourceDto) {
    return this.resourcesService.create(body);
  }

  @Put()
  overwrite(@Body() body: CreateResourceDto) {
    return this.resourcesService.overwrite(body);
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll(this.ctx.user.name);
  }

  @Head(':id') // NOTE - The Head method must be defined before the Get method
  checkOne(@Param('id') id: string) {
    return this.resourcesService.checkOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateResourceDto) {
    return this.resourcesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
