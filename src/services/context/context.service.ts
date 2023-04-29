import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Tenant, User } from 'src/routes';

@Injectable()
export class ContextService {
  constructor(private readonly cls: ClsService) { }

  get auth(): Auth {
    return this.cls.get<Auth>('auth');
  }

  set auth(val: Auth) {
    this.cls.set<Auth>('auth', val);
  }

  get tenant(): Tenant {
    return this.cls.get<Tenant>('tenant');
  }

  set tenant(val: Tenant) {
    this.cls.set<Tenant>('tenant', val);
  }

  get user(): User {
    return this.cls.get<User>('user');
  }

  set user(val: User) {
    this.cls.set<User>('user', val);
  }

  get trace(): LogTrace {
    return this.cls.get<LogTrace>('trace');
  }

  set trace(val: LogTrace) {
    this.cls.set<LogTrace>('trace', val);
  }
}

export interface Auth {
  token: string;
  tenantId: string;
  clientId: string;
  userId: string;
  email: string;
  name: string;
  groups: string[];
}
interface LogTrace {
  groupId: string | undefined;
  streamId: string | undefined;
  requestId: string | undefined;
}
export interface Aux {
  auth: Auth;
  tenant: Tenant;
  user: User;
}
