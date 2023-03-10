/*
https://docs.nestjs.com/interceptors#interceptors
*/

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClsKeys, LogTrace } from './cls';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AppInterceptor.name);

  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<FastifyRequest>();
    const res = http.getResponse<FastifyReply>();
    const userAgent = req.headers['user-agent'] || '';
    const { ip, method, url } = req;
    const logTrace = this.cls.get<LogTrace>(ClsKeys.logTrace);
    this.logger.verbose(`Request intercepted: ${logTrace.requestId}`);
    this.logger.verbose(
      `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`
    );
    return next.handle().pipe(
      tap(() => {
        this.logger.verbose(`Response intercepted: ${logTrace.requestId}`);

        this.logger.verbose(`Response time: ${res.getResponseTime()}`);
      })
    );
  }
}
