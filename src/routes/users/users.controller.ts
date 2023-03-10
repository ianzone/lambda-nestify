import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Group, Groups, GroupsGuard } from 'src/guards';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(GroupsGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    await this.cache.set('1', body);
    return this.usersService.create(body);
  }

  @Groups(Group.admin)
  @Get()
  async findAll(@Query() query: QueryUserDto) {
    query.age && console.log(typeof query.age);
    return this.usersService.findAll();
  }

  @Get('login')
  login(@Res() res) {
    res.status(302).redirect('id');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const val = await this.cache.get(id);
    this.logger.verbose({ findOne: { cache: val } });
    return val || this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
