/*
https://docs.nestjs.com/middleware#middleware
*/

import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { parse } from 'querystring';

@Injectable()
export class DocsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DocsMiddleware.name);
  use(req: IncomingMessage, res: any, next: Function) {
    this.logger.verbose('');
    const { token } = parse(req.url.split('?')[1]);
    this.logger.verbose(`docs access token: ${token}`);
    if (!token) {
      throw new UnauthorizedException();
    }
    return next();
  }
}
