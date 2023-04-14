import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { mock } from 'src/configs';
import { ContextService } from 'src/services';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel('users')
    private users: Model<User, { id: string; tenantId: string }>,
    private readonly ctx: ContextService,
  ) {}

  create(body: CreateUserDto) {
    return this.users.create(body, { overwrite: true, return: 'item' });
  }

  findAll() {
    // TODO: add unit test
    if (mock.enable) {
      return [mock.user];
    }
    const auth = this.ctx.auth;
    return this.users.query('tenantId').eq(auth.tenantId).exec();
  }

  findOne(id: string) {
    // TODO: add unit test
    if (mock.enable) {
      return mock.user;
    }

    const auth = this.ctx.auth;
    return this.users.get({ id, tenantId: auth.tenantId });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    const auth = this.ctx.auth;
    return this.users.delete({ id, tenantId: auth.tenantId });
  }
}
