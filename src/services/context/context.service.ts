import { Injectable } from '@nestjs/common';
import { ClsService, ClsStore } from 'nestjs-cls';
import { Tenant, User } from 'src/routes';

// NOTE - ContextService should not be used in providers' constructor to make providers more pure
@Injectable()
export class ContextService {
  constructor(private readonly cls: ClsService<CtxStore>) {}

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

  get trace() {
    return this.cls.get<string>('trace');
  }

  set trace(val: string) {
    this.cls.set<string>('trace', val);
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

export interface Aux {
  auth: Auth;
  tenant: Tenant;
  user: User;
}

export type CtxStore = ClsStore & Aux;
