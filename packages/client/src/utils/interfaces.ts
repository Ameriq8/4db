import { ForeignKeyActionTypes } from './types';

export interface ILogger {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  debug(data: any): void;
}

export interface IConnectionDetails {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface IModel {
  findOne(IFindOneOptions): Promise<void>;
  findMany(): Promise<any>;
  findOneAndUpate(): Promise<any>;
  findManyAndUpdate(): Promise<any>;
  findOrCreate(): Promise<any>;
  updateOne(): Promise<any>;
  updateMany(): Promise<any>;
  deleteOne(): Promise<any>;
  deleteMany(): Promise<any>;
  create(): Promise<any>;
  createMany(): Promise<any>;
  count(): Promise<number>;
  exists(): Promise<boolean>;
}

export interface ISchema {
  [key: string]: IColumn;
}

export interface IColumn {
  type: keyof TypesMap;
  array?: boolean;
  unique?: boolean;
  primary?: boolean;
  nullable?: boolean;
  check?: string;
  default?: any;
  foreignKey?: IForeignKey;
  comment?: string;
}

export interface IForeignKey {
  column: string;
  references: string;
  referencesColumn: string;
  onDelete: ForeignKeyActionTypes;
  onUpdate: ForeignKeyActionTypes;
}

export interface IWhereInput {
  where: any | null;
}

export interface IUpdateInput extends IWhereInput {
  data: any | null;
}

export interface IFindOneOptions extends IWhereInput {}

export interface TypesMap {
  BIGINT: bigint | number;
  BIGSERIAL: bigint | number;
  SERIAL: bigint | number;
  SMALLSERIAL: number;
  FLOAT8: number;
  INTEGER: number;
  SMALLINT: number;

  BOOLEAN: boolean;

  VARCHAR: string;
  character: string;
  BPCHAR: string;
  TEXT: string;

  JSON: JSON;
  JSONB: JSON;

  DATE: Date;
  TIMESTAMP: Date;
  TIMESTAMPTZ: Date;

  UUID: string;
}
