import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage, ServerResponse } from 'http';
import { Configs } from 'src/configs';

@Injectable()
export class DocsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DocsMiddleware.name);

  constructor(private readonly configs: ConfigService<Configs>) {}

  use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const filter = [
      'swagger-ui.css',
      'swagger-ui-bundle.js',
      'swagger-ui-standalone-preset.js',
      'favicon-16x16.png',
      'favicon-32x32.png',
    ];
    const url = req?.url || '';
    const file = filter.find((e) => url.includes(e));
    if (file) {
      res.writeHead(301, {
        Location: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.0.0-alpha.8/${file}`,
      });
      res.end();
      return next();
    }
    if (url.includes('swagger-ui-init.js')) {
      return next();
    }
    const authString = Buffer.from(
      req.headers.authorization?.split('Basic ')[1] || '',
      'base64'
    ).toString('ascii');
    this.logger.debug(`docs auth: ${authString}`);
    if (authString !== 'docs:Secure_2023') {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic',
      });
      res.end();
      return next();
    }
    return next();
  }
}
