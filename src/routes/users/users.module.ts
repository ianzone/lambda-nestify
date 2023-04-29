import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { Configs } from 'src/configs';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [
    DynamooseModule.forFeatureAsync([
      {
        inject: [ConfigService],
        useFactory: (_, configs: ConfigService<Configs>) => ({
          tableName: configs.get<string>('usersTable'),
          schema: UserSchema,
        }),
        name: 'users',
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
