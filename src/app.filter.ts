import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { ContextService } from './services';

// https://docs.nestjs.com/exception-filters#exception-filters
@Catch()
export class AppFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AppFilter.name);

  constructor(private readonly ctx: ContextService) {
    super();
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const obj = host.switchToHttp();
    const req = obj.getRequest<FastifyRequest>();
    const res = obj.getResponse<FastifyReply | ServerResponse>();
    const ctx = {
      Method: req.method,
      Path: req.url,
      Params: req.params,
      Query: req.query,
      Headers: req.headers,
      Body: req.body,
      Auth: this.ctx.auth,
      Tenant: this.ctx.tenant,
      User: this.ctx.user,
    };

    let statusCode = 500;
    let message = '';
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const expRes = exception.getResponse() as any;
      message = expRes.message;
      if (statusCode === 404) {
        super.catch(exception, host);
        return;
      }
      this.logger.warn(ctx, exception.stack);
    } else {
      // unexpected errors that need to trigger alerts
      this.logger.error(ctx, exception.stack);
      message = exception.message;
    }

    const logTrace = this.ctx.trace;

    this.logger.debug(
      '========================================================================================================================',
    );

    if (res instanceof ServerResponse) {
      // in case of thrown from middlewares, the FastifyRequest is not ready
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ ...logTrace, message }));
      res.end();
    } else {
      res.status(statusCode).send({ ...logTrace, message });
    }
  }
}
