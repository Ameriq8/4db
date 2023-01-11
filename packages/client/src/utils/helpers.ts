import { v4 as uuidv4 } from 'uuid';
import { IColumn, IConnectionDetails, ISchema, TypesMap } from './interfaces';

export const regex = {
  v4: /(?:^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u,
  v5: /(?:^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u,
};

export const jsonSchema = {
  v4: { type: 'string', pattern: regex.v4.toString().slice(1, -2) },
  v5: { type: 'string', pattern: regex.v5.toString().slice(1, -2) },
};

export const parseModelToSQLTable = (tableName, model: ISchema): string => {
  const typesAcceptsMaxLength = ['character', 'varchar', 'text'];
  let sql = '';

  sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

  const keys = Object.keys(model);

  for (const key of keys) {
    const column: IColumn = model[key];

    sql += `  ${key} ${column.type}`;

    if (column.maxLength != undefined) {
      if (column.maxLength >= 1 && typesAcceptsMaxLength.includes(column.type))
        sql += `(${column.maxLength})`;
      else throw new Error('Maximum length must be 1 or more than it');
    } else if (column.maxLength != undefined && typeof column.maxLength != 'number')
      new TypeError('Invalid type to use a maximum length with it.');

    if (column.array) sql += '[]';

    if (column.unique) sql += ' UNIQUE';

    if (column.primary) sql += ' PRIMARY KEY';

    if (!column.nullable) sql += ' NOT NULL';

    if (column.check) {
      if (column.check.startsWith('CHECK')) sql += ` ${column.check}`;
      else throw new TypeError('Invalid type provided');
    }

    if (column.default) {
      switch (column.type) {
        case 'bigint':
        case 'bigserial':
        case 'serial':
        case 'smallserial':
        case 'float8':
        case 'integer':
        case 'smallint':
          sql += ` DEFAULT ${validateNumber(column.default, column.type)}`;
          break;

        case 'boolean':
          sql += ` DEFAULT ${column.default ? 'TRUE ' : 'FALSE'}`;
          break;

        case 'varchar':
        case 'character':
        case 'text':
          sql += ` DEFAULT ${column.default}`;
          break;

        case 'json':
        case 'jsonb':
          try {
            sql += ` DEFAULT ${JSON.stringify(column.default)}`;
          } catch (err) {
            throw new Error(err);
          }
          break;

        case 'date':
        case 'timestamp':
        case 'timestamptz':
          if (column.default === 'now()') sql += ` DEFAULT ${column.default}`;
          sql += ` DEFAULT ${validateDate(column.default, column.type)}`;
          break;

        default:
          throw new TypeError(`Invalid data type: ${column.type}`);
      }
    }

    if (column.foreignKey)
      sql += ` FOREIGN KEY (${column.foreignKey.column}) REFERENCES ${column.foreignKey.references} (${column.foreignKey.referencesColumn}) ON DELETE ${column.foreignKey.onDelete} ON UPDATE ${column.foreignKey.onUpdate}`;

    sql += ',\n';
  }

  sql = sql.slice(0, -2) + '\n);';

  return sql;
};

export const validateNumber = (num: Number, type: keyof TypesMap): String => {
  switch (type) {
    case 'smallint':
      if (num < -32768 || num > 32767) {
        throw new Error(`Number out of range for SMALLINT data type: ${num}`);
      }
      break;

    case 'integer':
      if (num < -2147483648 || num > 2147483647) {
        throw new Error(`Number out of range for INTEGER data type: ${num}`);
      }
      break;

    case 'float8':
      if (Number.isInteger(num)) {
        if (num < -1.7976931348623157e308 || num > 1.7976931348623157e308) {
          throw new Error(`Number out of range for FLOAT8 data type: ${num}`);
        }
      }
      break;

    case 'smallserial':
      if (Number.isInteger(num)) {
        if (num < 1 || num > 32767) {
          throw new Error(`Number out of range for SMALLSERIAL data type: ${num}`);
        }
      }
      break;

    case 'serial':
      if (Number.isInteger(num)) {
        if (num < 1 || num > 2147483647) {
          throw new Error(`Number out of range for SERIAL data type: ${num}`);
        }
      }
      break;

    case 'bigserial':
      if (Number.isInteger(num)) {
        if (num < 1 || num > 9223372036854775807) {
          throw new Error(`Number out of range for BIGSERIAL data type: ${num}`);
        }
      }
      break;

    case 'bigint':
      if (num < -9223372036854775808 || num > 9223372036854775807) {
        throw new Error(`Number out of range for BIGINT data type: ${num}`);
      }
      break;

    default:
      throw new TypeError(`Invalid data type: ${type}`);
  }

  return num.toString();
};

export const validateDate = (date: Date, type: keyof TypesMap) => {
  switch (type) {
    case 'date':
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date.toISOString())) {
        throw new Error(`Invalid format for DATE data type: ${date.toISOString()}`);
      }
      break;

    case 'timestamp':
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date.toISOString())) {
        throw new Error(`Invalid format for TIMESTAMP data type: ${date.toISOString()}`);
      }
      break;

    case 'timestamptz':
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date.toISOString())) {
        throw new Error(`Invalid format for TIMESTAMPTZ data type: ${date.toISOString()}`);
      }
      break;

    default:
      throw new TypeError(`Invalid data type: ${type}`);
  }

  return date.toISOString();
};

export const parsePostgresUrl = (url: string): IConnectionDetails => {
  const urlRegex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(urlRegex);
  if (!match) throw new Error(`Invalid PostgreSQL URL: ${url}`);

  const [host, port, database, username, password] = match;

  return {
    host,
    port: parseInt(port),
    database,
    username,
    password,
  };
};

export const parseObjectToSqlParams = (where: object): string => {
  let whereParams: string[] = [];
  for (let key in where) {
    if (where.hasOwnProperty(key)) {
      let value = where[key];
      whereParams.push(`${key} = ${value}`);
    }
  }

  return whereParams.join(' AND ');
};

export const parseToInsertQuery = (tableName: string, obj: any) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  const columns = keys.join(', ');
  const vals = values
    .map((value) => `${typeof value === 'string' ? `'${value}'` : value}`)
    .join(', ');

  const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${vals});`;

  console.log(sql);

  return sql;
};

export const checkAndChangeUuidSchema = (input: any, schema: any) => {
  for (let column in schema) {
    if (schema[column].type === 'uuid') {
      input[column] ? input[column].toString() : (input[column] = uuidv4().toString());
    }
  }

  return input;
};
