/*
https://docs.nestjs.com/middleware#middleware
*/

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { ClsService } from 'nestjs-cls';
import { ClsKeys, LogTrace } from 'src/cls';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LogMiddleware.name);

  constructor(private readonly cls: ClsService) {}

  use(req: IncomingMessage, res: any, next: Function) {
    this.logger.verbose('prepare log trace');
    const id = new Date();
    this.cls.set<LogTrace>(ClsKeys.logTrace, {
      groupId: 'groupId',
      streamId: 'streamId',
      requestId: `requestId ${id}`,
    });
    return next();
  }
}
