export default (): Configs => {
  const isOffline = process.env.NODE_ENV === 'dev' || process.env.IS_OFFLINE === 'true';
  const baseUrl = isOffline ? 'http://localhost:30000' : 'https://service.my-domain.com';
  const stagePath = process.env.STAGE_PATH || '';
  return {
    baseUrl: `${baseUrl}${stagePath}`,
    mode: Mode.dev,
    stagePath,
  };
};

export interface Configs {
  baseUrl: string;
  mode: Mode;
  stagePath: string;
}

export enum Mode {
  local,
  dev,
  prod,
}

export const settings = {
  mock: true,
  tenantsTable: 'demo-tenants',
  usersTable: 'demo-users',
};
