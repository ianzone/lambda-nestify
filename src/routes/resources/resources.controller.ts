import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  Logger,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
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
  private logger = new Logger(ResourcesController.name);

  constructor(
    private readonly ctx: ContextService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @Post()
  create(@Body() body: CreateResourceDto) {
    const { user } = this.ctx;
    return this.resourcesService.create(user.id, body);
  }

  @Put()
  overwrite(@Body() body: CreateResourceDto) {
    return this.resourcesService.overwrite(body);
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll(this.ctx.user.id);
  }

  @Head(':id') // NOTE - The Head method must be defined before the Get method
  checkOne(@Param('id') id: string) {
    return this.resourcesService.checkOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(this.ctx.user.id, id);
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
