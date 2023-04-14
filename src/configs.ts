import { LogLevel } from '@nestjs/common';
import { Tenant, User } from './routes';
import { Auth } from './services';

export default (): Configs => {
  const isOffline = process.env.NODE_ENV === 'dev' || process.env.IS_OFFLINE === 'true';
  const baseUrl = isOffline
    ? `http://localhost:${process.env.DEV_PORT}`
    : `https://${process.env.DOMAIN}`;
  const stagePath = process.env.STAGE_PATH || '';

  const tenantsTable = process.env.tenantsTable;
  const usersTable = process.env.usersTable;
  if (!tenantsTable) {
    throw new Error('Missing tenant table');
  }
  if (!usersTable) {
    throw new Error('Missing user table');
  }

  return {
    tenantsTable,
    usersTable,
    baseUrl: `${baseUrl}${stagePath}`,
    basePath: stagePath,
    logLevel: stagePath === '/dev' ? ['debug'] : ['error'],
  };
};

export interface Configs {
  tenantsTable: string;
  usersTable: string;
  baseUrl: string;
  basePath: string;
  logLevel: LogLevel[];
}

const auth: Auth = {
  token: 'jwt access token',
  tenantId: 'userPoolId',
  clientId: 'clientId',
  userId: 'cognitoSub',
  email: 'yiheng.work@gmail.com',
  name: 'Yiheng',
  groups: ['admin'],
};
const user: User = {
  tenantId: '',
  id: '',
  email: '',
  name: '',
};
const tenant: Tenant = {
  id: '',
  name: '',
  clientId: [''],
  url: {
    apps: '',
    portal: '',
    terms: '',
    privacy: '',
  },
  sdk: {
    key: '',
  },
};

export const mock = {
  enable: false,
  user,
  tenant,
  auth,
};
