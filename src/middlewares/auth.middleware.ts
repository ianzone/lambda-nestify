import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IncomingMessage, ServerResponse } from 'http';
import { TenantsService, UsersService } from 'src/routes';
import { Aux, ContextService } from 'src/services';
import { verify } from 'src/utils';

interface Req extends IncomingMessage {
  originalUrl: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly tenants: TenantsService,
    private readonly users: UsersService,
    private readonly ctx: ContextService
  ) {}

  // https://www.fastify.io/docs/latest/Reference/Middleware/
  async use(req: Req, res: ServerResponse, next: Function) {
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

    try {
      // get tenant credentials from the tenant service
      this.ctx.tenant = await this.tenants.findOne(auth.tenantId);
      this.logger.debug({ tenant: this.ctx.tenant });
    } catch (err) {
      throw new UnauthorizedException('invalid tenant');
    }

    try {
      // get user details
      this.ctx.user = await this.users.findOne(auth.tenantId, auth.userId);
      this.logger.debug({ user: this.ctx.user });
    } catch (err) {
      throw new UnauthorizedException('invalid user');
    }

    const auxData: Aux = {
      auth,
      tenant: this.ctx.tenant,
      user: this.ctx.user,
    };

    this.cache.set(jwt, auxData);
    return next();
  }
}
