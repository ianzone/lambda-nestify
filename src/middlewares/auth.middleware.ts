import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { decomposeUnverifiedJwt } from 'aws-jwt-verify/jwt';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Cache } from 'cache-manager';
import { IncomingMessage, ServerResponse } from 'http';
import { mock } from 'src/configs';
import { TenantsService, UsersService } from 'src/routes';
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
  ) {}

  // https://www.fastify.io/docs/latest/Reference/Middleware/
  async use(req: IncomingMessage, res: ServerResponse, next: Function) {
    try {
      const authorization = req.headers.authorization;
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
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}

async function verify(jwt: string): Promise<Auth> {
  const attr = await getUser(jwt);

  // decode jwt and get tenantId from it
  const decode = decomposeUnverifiedJwt(jwt).payload as CognitoAccessTokenPayload;

  const auth = {
    token: jwt,
    tenantId: decode.iss.split('com/')[1],
    clientId: decode.client_id,
    userId: decode.sub,
    email: attr.email,
    name: attr.name,
    groups: decode['cognito:groups'] || [],
  };
  if (mock.enable) {
    return mock.auth;
  }
  return auth;
}

async function getUser(accessToken: string) {
  const command = new GetUserCommand({ AccessToken: accessToken });

  const data = await new CognitoIdentityProviderClient({}).send(command);
  const attrs = data.UserAttributes || [];
  let email_verified;
  let email;
  let firstName;
  let lastName;
  for (const item of attrs) {
    if (item.Name === 'email_verified') {
      email_verified = item.Value;
    }
    if (item.Name === 'email') {
      email = item.Value;
    }
    if (item.Name === 'custom:FirstName') {
      firstName = item.Value;
    }
    if (item.Name === 'custom:LastName') {
      lastName = item.Value;
    }
  }
  if (email_verified === 'false') {
    throw new Error('email not verified');
  }
  return {
    email,
    name: `${firstName} ${lastName}`,
  };
}
