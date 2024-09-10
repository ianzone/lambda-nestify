/*
https://docs.nestjs.com/interceptors#interceptors
*/

import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Context } from 'aws-lambda';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { ContextService } from './services';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AppInterceptor.name);

  constructor(private readonly ctx: ContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<FastifyRequest>();
    const res = http.getResponse<FastifyReply>();
    const userAgent = req.headers['user-agent'] || '';
    const { ip, method, url } = req;

    // @ts-ignore
    const cxt = req?.awsLambda?.context as Context;
    this.ctx.trace = cxt?.logGroupName
      ? `https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/${encodeURIComponent(
          encodeURIComponent(cxt.logGroupName),
        )}/log-events/${encodeURIComponent(encodeURIComponent(cxt.logStreamName))}`
      : '';

    this.logger.debug(
      `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );
    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`Response time: ${res.getResponseTime()}`);
        this.logger.debug(
          '========================================================================================================================',
        );
      }),
    );
  }
}
