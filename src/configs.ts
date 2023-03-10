export default (): Configs => {
  return {
    mode: Mode.dev,
    db: {
      key: 'database connection key',
    },
  };
};

export interface Configs {
  mode: Mode;
  db: {
    key: string;
  };
}

export enum Mode {
  local,
  dev,
  prod,
}
