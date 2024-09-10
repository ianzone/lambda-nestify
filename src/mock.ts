import type { Tenant, User } from './routes';
import type { Auth } from './services';

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
  tenantId: 'userPoolId',
  id: 'cognitoSub',
  email: 'yiheng.work@gmail.com',
  name: 'ian',
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

export { auth, user, tenant };
