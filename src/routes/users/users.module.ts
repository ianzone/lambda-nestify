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
          options: {
            tableName: configs.get<string>('usersTable'),
            // https://dynamoosejs.com/other/FAQ#why-is-it-recommended-to-set-create-update--waitforactive-model-options-to-false-for-production-environments
            create: false,
            update: false,
            waitForActive: false,
          },
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
