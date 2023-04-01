import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'querystring';
import { Configs } from 'src/configs';

@Injectable()
export class DocsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DocsMiddleware.name);
  constructor(private readonly configs: ConfigService<Configs>) {}
  use(req: IncomingMessage, res: ServerResponse, next: Function) {
    const filter = [
      'swagger-ui.css',
      'swagger-ui-bundle.js',
      'swagger-ui-standalone-preset.js',
      'favicon-16x16.png',
      'favicon-32x32.png',
    ];
    const file = filter.find((e) => req.url.includes(e));
    if (file) {
      res.writeHead(301, { Location: `${this.configs.get('stagePath')}/public/${file}` });
      res.end();
      return next();
    }
    if (req.url.includes('swagger-ui-init.js')) {
      return next();
    }
    this.logger.verbose('');
    const { token } = parse(req.url.split('?')[1]);
    this.logger.verbose(`docs access token: ${token}`);
    if (!token) {
      throw new UnauthorizedException();
    }
    return next();
  }
}
