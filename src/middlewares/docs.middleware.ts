import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import fs from 'fs';
import { ServerResponse } from 'http';
import path from 'path';
import { Configs } from 'src/configs';

function bufferFile(filename: string) {
  return fs.readFileSync(path.join(path.resolve(), 'node_modules/swagger-ui-dist/', filename));
}
@Injectable()
export class DocsMiddleware implements NestMiddleware {
  constructor(private readonly configs: ConfigService<Configs>) {}

  use(req: FastifyRequest, res: ServerResponse, next: () => void) {
    if (req.originalUrl.includes('swagger-ui-init.js')) {
      return next();
    }

    const lastPath = req.originalUrl.split('/').pop() || '';

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
        // @ts-ignore not a static asset
        if (req.query?.token !== this.configs.get<string>('token')) {
          throw new UnauthorizedException();
        }
        return next();
    }

    res.write(bufferFile(lastPath));
    res.end();
    return next();
  }
}
