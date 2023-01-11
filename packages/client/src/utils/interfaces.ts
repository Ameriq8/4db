import { ForeignKeyActionTypes, TypeObject } from './types';

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

// export interface IModel {
//   findOne(IFindOneOptions): Promise<any>;
//   findMany(): Promise<any>;
//   findOneAndUpate(): Promise<any>;
//   findManyAndUpdate(): Promise<any>;
//   findOrCreate(): Promise<any>;
//   updateOne(): Promise<any>;
//   updateMany(): Promise<any>;
//   deleteOne(): Promise<any>;
//   deleteMany(): Promise<any>;
//   create(): Promise<any>;
//   createMany(): Promise<any>;
//   count(): Promise<number>;
//   exists(): Promise<boolean>;
// }

export interface ISchema {
  [key: string]: IColumn;
}

export interface IColumn {
  type: keyof TypesMap;
  array?: boolean;
  maxLength?: number;
  unique?: boolean;
  primary?: boolean;
  nullable: boolean;
  check?: string;
  default?: any;
  foreignKey?: IForeignKey;
}

export interface IForeignKey {
  column: string;
  references: string;
  referencesColumn: string;
  onDelete: ForeignKeyActionTypes;
  onUpdate: ForeignKeyActionTypes;
}

export interface IWhereInput<S extends ISchema> {
  where: TypeObject<S, true>;
}

export interface IUpdateInput<S extends ISchema> extends IWhereInput<S> {
  data: TypeObject<S, true> | null;
}

export interface ICreateInput<S extends ISchema> {
  data: TypeObject<S, true>;
}

export interface TypesMap {
  bigint: bigint | number;
  bigserial: bigint | number;
  serial: bigint | number;
  smallserial: number;
  float8: number;
  integer: number;
  smallint: number;

  boolean: boolean;

  varchar: string;
  character: string;
  text: string;

  json: JSON;
  jsonb: JSON;

  date: Date;
  timestamp: Date;
  timestamptz: Date;

  uuid: string;
}
