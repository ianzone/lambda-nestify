export const ClsKeys = {
  logTrace: 'logTrace',
  reqAux: 'reqAux',
};

interface User {
  token: string;
  userPoolId: string;
  clientId: string;
  userId: string;
  groups: Set<string>;
}

interface Tenant {
  thirdPartyKey: string;
}

export interface LogTrace {
  groupId: string;
  streamId: string;
  requestId: string;
}

export interface ReqAux {
  user: User;
  tenant: Tenant;
}
