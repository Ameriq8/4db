import { ISchema, TypesMap } from './interfaces';

export type ForeignKeyActionTypes = 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION';

export type Convert<T extends ISchema> = {
  [prop in keyof T]: TypesMap[T[prop]['type']];
};
