import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { DynamooseModule } from 'nestjs-dynamoose';
import { AuthMiddleware, DocsMiddleware } from 'src/middlewares';
import { ResourcesController, RoutesModule, UsersController } from 'src/routes';
import { ServicesModule } from 'src/services';
import { AppController } from './app.controller';
import { AppFilter } from './app.filter';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';
import configs from './configs';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { // the ClsMiddleware is mounted below
        generateId: true,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000, // milliseconds, max apigateway timeout
      max: 10000, // max items in cache
    }),
    ServicesModule,
    RoutesModule,
    ConfigModule.forRoot({
      load: [configs],
      isGlobal: true,
      cache: true,
    }),
    DynamooseModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // middleware are mounted in order
    // ClsMiddleware has to be mounted first
    consumer.apply(ClsMiddleware).exclude('/docs/(.*)').forRoutes('(.*)');

    consumer.apply(AuthMiddleware).exclude().forRoutes(UsersController, ResourcesController);

    consumer.apply(DocsMiddleware).forRoutes('/docs', '/docs-json');
  }
}
