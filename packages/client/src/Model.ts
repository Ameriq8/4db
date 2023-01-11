import { Client } from './Client';
import {
  checkAndChangeUuidSchema,
  parseModelToSQLTable,
  parseObjectToSqlParams,
  parseToInsertQuery,
} from './utils/helpers';
import { IWhereInput, ISchema, ICreateInput } from './utils/interfaces';

export function model<T extends ISchema>(tableName: string, schema: T, client: Client) {

  if (!tableName) throw new Error('tableName is required field');
  if (!schema) throw new Error('schema is required field');
  if (!client) throw new Error('client is required field');

  class Model {
    static async findOne({ where }: IWhereInput<T>): Promise<any> {
      return await client.query(
        `SELECT * FROM ${tableName} WHERE ${parseObjectToSqlParams(where)};`[0],
      );
    }

    // static async findMany(where: IWhereInput<T>) {}

    static async create({ data }: ICreateInput<T>) {
      const newData = checkAndChangeUuidSchema(data, schema);
      const res = await client
        .query(parseToInsertQuery(tableName, newData))
        .catch((err) => console.log(err));
      // console.log(res);
      return res;
    }

    static async build(): Promise<void> {
      const query = parseModelToSQLTable(tableName, schema);
      // console.log(query)
      await client.query(query).catch((err) => {
        console.log(err);
      });
    }
  }

  return Model;
}
