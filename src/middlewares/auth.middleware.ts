import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { IncomingMessage } from 'http';
import { ClsService } from 'nestjs-cls';
import { ClsKeys, ReqAux } from 'src/cls';
import { Configs, Mode } from 'src/configs';
import { TenantsService } from 'src/services';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private readonly cls: ClsService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly tenants: TenantsService,
    private readonly configs: ConfigService<Configs>
  ) {}

  // in fastify middleware, the req object is the raw node request object
  // https://www.fastify.io/docs/latest/Reference/Middleware/
  async use(req: IncomingMessage, res: any, next: () => void) {
    this.logger.verbose('');
    if (this.configs.get('mode') === Mode.local) return next();

    try {
      const authorization = req.headers.authorization;
      const jwt = authorization?.split('Bearer ')[1];
      if (!jwt) throw new Error('missing authorization');

      const auxDataCache = (await this.cache.get(jwt)) as any;
      if (auxDataCache) {
        this.cls.set<ReqAux>(ClsKeys.reqAux, auxDataCache);
        return next();
      }

      this.logger.verbose('decode jwt and get tenantId from it');
      this.logger.verbose('get tenant credentials from the tenant service');
      await this.tenants.ormMethods('tenantId');
      this.logger.verbose('verify the jwt against tenant credentials');

      const auxData = {
        user: {
          token: jwt,
          userPoolId: 'string',
          clientId: 'string',
          userId: 'userId',
          groups: new Set(['admin']),
        },
        tenant: {
          thirdPartyKey: 'thirdPartyKey',
        },
      };

      this.cache.set(jwt, auxData);
      this.cls.set<ReqAux>(ClsKeys.reqAux, auxData);
      return next();
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
