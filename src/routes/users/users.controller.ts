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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Group, Groups, GroupsGuard } from 'src/guards';
import { ContextService } from 'src/services';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Groups(Group.admin)
@UseGuards(GroupsGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly ctx: ContextService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put()
  overwrite(@Body() body: CreateUserDto) {
    return this.usersService.overwrite(body);
  }

  @Head(':id') // NOTE - The Head method must be defined before the Get method
  checkOne(@Param('id') id: string) {
    if (this.ctx.user.id === id) {
      return this.ctx.user;
    }
    return this.usersService.checkOne(this.ctx.auth.tenantId, id);
  }

  @Get()
  findAll(@Query() query: QueryUserDto) {
    const { auth } = this.ctx;
    return this.usersService.findAll(auth.tenantId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (this.ctx.user.id === id) {
      return this.ctx.user;
    }
    return this.usersService.findOne(this.ctx.auth.tenantId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const { auth } = this.ctx;
    return this.usersService.update(auth.tenantId, id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const { auth } = this.ctx;
    return this.usersService.remove(auth.tenantId, id);
  }
}
