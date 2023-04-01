import { Global, Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { settings } from 'src/configs';
import { UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [DynamooseModule.forFeature([{ name: settings.usersTable, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
