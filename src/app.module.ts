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
import { LoggerModule } from 'nestjs-pino';
import { AuthMiddleware, DocsMiddleware, LogMiddleware } from 'src/middlewares';
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
    LoggerModule.forRoot({
      pinoHttp: {
        // customProps: (req, res) => ({
        //   context: 'HTTP',
        // }),
        level: 'trace',
        transport: {
          // https://github.com/pinojs/pino-pretty
          target: 'pino-pretty',
        },
        autoLogging: false,
      },
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
    const mid = (req: any, res: any, next: any) => {
      console.log(req.url);
      return next();
    };
    consumer.apply(mid).forRoutes('/');

    // middleware are mounted in order
    // ClsMiddleware has to be mounted first
    consumer.apply(ClsMiddleware, LogMiddleware).exclude('/docs/(.*)').forRoutes('(.*)');

    consumer
      .apply(AuthMiddleware)
      .exclude('/', '/docs(.*)', '/docs-json', '/favicon.ico')
      .forRoutes('(.*)');

    consumer.apply(DocsMiddleware).exclude('/docs/(.*)').forRoutes('/docs', '/docs-json/$');
  }
}
