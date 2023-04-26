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
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Groups(Group.admin)
@UseGuards(GroupsGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put()
  overwrite(@Body() body: CreateUserDto) {
    return this.usersService.overwrite(body);
  }

  @Get()
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll();
  }

  @Head(':id')
  checkOne(@Param('id') id: string) {
    return this.usersService.checkOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
