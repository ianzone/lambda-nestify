import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { mock } from 'src/configs';
import { QueryUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('users')
    private users: Model<User, { id: string; tenantId: string }>
  ) {}

  create(body: CreateUserDto) {
    return this.users.create(body);
  }

  overwrite(body: CreateUserDto) {
    return this.users.create(body, { overwrite: true, return: 'item' });
  }

  findAll(tenantId: string, query: QueryUserDto) {
    // TODO: add unit test
    if (mock.enable) {
      return [mock.user];
    }

    const res = this.users
      .query()
      .filter('tenantId')
      .eq(tenantId)
      .filter('name')
      .contains(query.name)
      .exec();

    return res;
  }

  checkOne(tenantId: string, id: string) {
    if (mock.enable) {
      return mock.user;
    }
    return this.users.get(
      { id, tenantId },
      {
        return: 'item',
        attributes: [],
      }
    );
  }

  findOne(tenantId: string, id: string) {
    // TODO: add unit test
    if (mock.enable) {
      return mock.user;
    }

    return this.users.get({ id, tenantId });
  }

  update(tenantId: string, id: string, body: UpdateUserDto) {
    return `This action updates a #${id} user with ${body}`;
  }

  remove(tenantId: string, id: string) {
    return this.users.delete({ id, tenantId });
  }
}
