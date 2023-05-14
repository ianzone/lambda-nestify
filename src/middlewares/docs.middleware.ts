import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { Configs } from 'src/configs';

@Injectable()
export class DocsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DocsMiddleware.name);

  constructor(private readonly configs: ConfigService<Configs>) {}

  use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const url = new URL(`${this.configs.get<string>('baseUrl')}${req.url}`);
    const pathname = url.pathname;

    if (pathname.includes('swagger-ui-init.js')) {
      return next();
    }

    const lastPath = pathname.split('/').pop() || '';

    switch (lastPath.split('.').pop()) {
      case 'html':
        res.setHeader('Content-Type', 'text/html');
        break;
      case 'css':
        res.setHeader('Content-Type', 'text/css');
        break;
      case 'js':
        res.setHeader('Content-Type', 'application/javascript');
        break;
      case 'map':
        res.setHeader('Content-Type', 'application/json');
        break;
      case 'png':
        res.setHeader('Content-Type', 'image/png');
        break;
      default:
        // not a static asset
        if (url.searchParams.get('token') !== this.configs.get<string>('token')) {
          throw new UnauthorizedException();
        }
        return next();
    }
    res.write(bufferFile(lastPath));
    res.end();
    return next();
  }
}

function bufferFile(filename: string) {
  return fs.readFileSync(path.join(path.resolve(), 'node_modules/swagger-ui-dist/', filename));
}
