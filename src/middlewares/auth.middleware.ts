import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IncomingMessage, ServerResponse } from 'http';
import { Tenant, TenantsService, UsersService } from 'src/routes';
import { Auth, Aux, ContextService } from 'src/services';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly tenants: TenantsService,
    private readonly users: UsersService,
    private readonly ctx: ContextService,
  ) {
    this.logger.verbose('initialized');
  }

  // https://www.fastify.io/docs/latest/Reference/Middleware/
  async use(req: IncomingMessage, res: ServerResponse, next: Function) {
    this.logger.verbose('');
    try {
      const authorization = req.headers.authorization;
      const jwt = authorization?.split('Bearer ')[1];
      if (!jwt) throw new Error('missing authorization');

      const auxDataCache = await this.cache.get<Aux>(jwt);
      if (auxDataCache) {
        this.logger.verbose('cache hit');
        this.ctx.auth = auxDataCache.auth;
        this.ctx.tenant = auxDataCache.tenant;
        this.ctx.user = auxDataCache.user;
        return next();
      }

      this.logger.verbose('decode jwt and get tenantId from it');
      this.logger.verbose('get tenant credentials from the tenant service');
      const tenant = await this.tenants.findOne('us-east-1_asdf');
      this.ctx.tenant = tenant;

      this.logger.verbose('verify the jwt against tenant credentials');
      const auth = await verify(tenant, jwt, this.ctx);

      // @ts-ignore
      if (req.originalUrl.split('/')[1] === 'users') {
        // just pass to the users route
        return next();
      }

      this.logger.verbose('get user details');
      const user = await this.users.findOne('asdf');
      this.ctx.user = user;

      const auxData: Aux = {
        auth,
        tenant,
        user,
      };

      this.cache.set(jwt, auxData);
      return next();
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}

async function verify(tenant: Tenant, jwt: string, ctx: ContextService): Promise<Auth> {
  const auth = {
    token: 'the jwt token',
    tenantId: 'us-east-asdf',
    clientId: 'asdfasdfadsfasdf',
    userId: 'asdf',
    email: 'test@test.com',
    groups: new Set(['admin']),
  };
  ctx.auth = auth;
  return auth;
}
