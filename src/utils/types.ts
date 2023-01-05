export type Action =  'new' | 'init';
export type ProviderType = 'PostgreSQL';
// export type CLIArguments = [option: Action, data: string];

export type FourDBConfig = {
  provider: ProviderType;
  database: string;
};
