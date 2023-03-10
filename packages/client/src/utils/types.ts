import { IColumn, ISchema, TypesMap } from './interfaces';

export type DriverTypes = 'json';

type If<B extends boolean, T1, T2 = null> = B extends true ? T1 : T2;

type Type<S extends IColumn> = If<S['nullable'], TypesMap[S['type']] | null, TypesMap[S['type']]>;

export type TypeObject<S extends ISchema, O extends boolean> = O extends true
  ? {
      [K in keyof S]?: Type<S[K]>;
    }
  : {
      [K in keyof S]: Type<S[K]>;
    };
