import client from './index';
import { parseModelToSQLTable } from './utils/helpers';
import { ISchema } from './utils/interfaces';
import { Convert } from './utils/types';

export async function model<T extends ISchema>(tableName: string, schema: T) {
  type S = Convert<T>;
 
console.log(client)
  await client.db(parseModelToSQLTable(tableName, schema));

  class Model {
    static async findOne(where: { where: S }) {
      return {
        id: 'hfdgdfr',
      };
    }
    static save() {}
  }
  return Model;
}
