import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IncomingMessage, ServerResponse } from 'http';
import { TenantsService, UsersService } from 'src/routes';
import { Aux, ContextService } from 'src/services';
import { verify } from 'src/utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly tenants: TenantsService,
    private readonly users: UsersService,
    private readonly ctx: ContextService,
  ) { }

  // https://www.fastify.io/docs/latest/Reference/Middleware/
  async use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    try {
      const { authorization } = req.headers;
      const jwt = authorization?.split('Bearer ')[1];
      if (!jwt) throw new Error('missing authorization');

      const auxDataCache = await this.cache.get<Aux>(jwt);
      if (auxDataCache) {
        this.logger.debug('cache hit');
        this.ctx.auth = auxDataCache.auth;
        this.ctx.tenant = auxDataCache.tenant;
        this.ctx.user = auxDataCache.user;
        return next();
      }

      // verify the jwt
      const auth = await verify(jwt);
      this.ctx.auth = auth;
      this.logger.debug({ auth });

      // get tenant credentials from the tenant service
      const tenant = await this.tenants.findOne(auth.tenantId);
      if (!tenant) throw new Error('invalid tenant');
      this.ctx.tenant = tenant;
      this.logger.debug({ tenant });

      // @ts-ignore
      if (req.originalUrl.includes('/users')) {
        return next();
      }

      // get user details
      let user = await this.users.findOne(auth.userId);
      if (!user) {
        // not a nylas user, use virtual account
        user = await this.users.findOne(auth.tenantId);
      }
      this.ctx.user = user;
      this.logger.debug({ user });

      const auxData: Aux = {
        auth,
        tenant,
        user,
      };

      this.cache.set(jwt, auxData);
      return next();
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }
  }
}
