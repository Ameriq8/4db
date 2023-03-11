import { DriverTypes, TypeObject } from './types';

export interface ILogger {
  success(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  debug(data: any): void;
}

export interface IClientOptions {
  driver: DriverTypes;
  filePath: string;
}

export interface ICollection {
  findOne(findOneInput): Promise<unknown>;
  findMany(findManyInput): Promise<unknown[]>;
  create(craeteInput): Promise<unknown>;
  update(updateInput): Promise<unknown>;
  delete(deleteInput): Promise<unknown>;
}

export interface ISchema {
  [key: string]: IColumn;
}

export interface IColumn {
  type: keyof TypesMap;
  maxLength?: number;
  unique?: boolean;
  nullable: boolean;
  default?: any;
}

export interface IWhereInput<S extends ISchema> {
  where: TypeObject<S, true>;
}

export interface IUpdateInput<S extends ISchema> extends IWhereInput<S> {
  data: TypeObject<S, true>;
}

export interface ICreateInput<S extends ISchema> {
  data: TypeObject<S, true>;
}

export interface TypesMap {
  integer: number;
  number: number;
  boolean: boolean;
  string: string;
  array: any[];
  json: JSON;
  jsonb: string;
  date: Date;
}
