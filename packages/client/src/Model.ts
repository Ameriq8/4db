import client from './index';
import { parseModelToSQLTable } from './utils/helpers';
import { ISchema } from './utils/interfaces';
import { Convert } from './utils/types';

export function model<T extends ISchema>(tableName: string, schema: T) {
  type S = Convert<T>;

  class Model {
    static async findOne(where: { where: S }) {
      await client.db(parseModelToSQLTable(tableName, schema));
      return {
        id: 'hfdgdfr',
      };
    }
    static async save() {
      await client.db(parseModelToSQLTable(tableName, schema));
    }
  }
  return Model;
}
