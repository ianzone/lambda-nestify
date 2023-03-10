import {
  CacheInterceptor,
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { AuthenticationMiddleware, DocsMiddleware, LogMiddleware } from 'src/middlewares';
import { RoutesModule } from 'src/routes';
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
    const swagger = ['/docs', '/docs-json', '/docs/(.*)', '/favicon.ico'];
    consumer
      .apply((req: any, res: any, next: any) => {
        console.log(req.originalUrl);
        return next();
      })
      .forRoutes('(.*)');
    // middleware are mounted in order
    consumer.apply(ClsMiddleware).exclude('/docs/(.*)').forRoutes('(.*)'); // ClsMiddleware has to be mounted first
    consumer.apply(LogMiddleware).exclude('/docs/(.*)').forRoutes('(.*)');
    consumer.apply(DocsMiddleware).exclude('/docs/(.*)').forRoutes('/docs', '/docs-json');
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('/', ...swagger)
      .forRoutes('(.*)');
  }
}
