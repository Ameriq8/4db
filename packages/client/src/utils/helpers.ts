import { IColumn, ISchema, TypesMap } from './interfaces';

export const CreateUUIDExtenstion = (sql) => {
  sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
};

export const parseModelToSQLTable = (tableName, model: ISchema): string => {
  // const typesAcceptsMaxLength = ['CHAR', 'VARCHAR', 'BPCHAR', 'TEXT'];
  let sql = '';

  sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

  const keys = Object.keys(model);

  for (const key of keys) {
    const column: IColumn = model[key];

    sql += `  ${key} ${column.type}`;

    // if (column.maxLength as Number > 0 && typesAcceptsMaxLength.includes(column.type))
    //   sql += `(${column.maxLength})`;
    // else throw new TypeError('Invalid type to use a maximum length with it.');

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
        case 'BIGINT':
        case 'BIGSERIAL':
        case 'FLOAT8':
        case 'INTEGER':
        case 'SMALLINT':
          sql += ` DEFAULT ${validateNumber(column.default, column.type)}`;
          break;

        case 'BOOLEAN':
          sql += ` DEFAULT ${column.default ? 'TRUE ' : 'FALSE'}`;
          break;

        case 'VARCHAR':
          // CHARACTER
        case 'character':
        case 'BPCHAR':
        case 'TEXT':
          sql += ` DEFAULT ${column.default}`;
          break;

        case 'JSON':
        case 'JSONB':
          try {
            sql += ` DEFAULT ${JSON.stringify(column.default)}`;
          } catch (err) {
            throw new Error(err);
          }
          break;

        case 'DATE':
        case 'TIMESTAMP':
        case 'TIMESTAMPTZ':
          if (column.default === 'now()') return (sql += ` DEFAULT ${column.default}`);
          sql += ` DEFAULT ${validateDate(column.default, column.type)}`;
          break;

        case 'UUID':
          sql += ` DEFAULT uuid_generate_v4 ()`;
          break;

        default:
          throw new TypeError(`Invalid data type: ${column.type}`);
      }
    }

    if (column.foreignKey)
      sql += `  FOREIGN KEY (${column.foreignKey.column}) REFERENCES ${column.foreignKey.references} (${column.foreignKey.referencesColumn}) ON DELETE ${column.foreignKey.onDelete} ON UPDATE ${column.foreignKey.onUpdate}`;

    if (column.comment) sql += `  COMMENT '${column.comment}'`;

    sql += ',\n';
  }

  sql = sql.slice(0, -2) + '\n);';

  console.log(sql)
  return sql;
};

export const validateNumber = (num: Number, type: keyof TypesMap): String => {
  switch (type) {
    case 'SMALLINT':
      if (num < -32768 || num > 32767) {
        throw new Error(`Number out of range for SMALLINT data type: ${num}`);
      }
      break;

    case 'INTEGER':
      if (num < -2147483648 || num > 2147483647) {
        throw new Error(`Number out of range for INTEGER data type: ${num}`);
      }
      break;

    case 'FLOAT8':
      if (Number.isInteger(num)) {
        if (num < -1.7976931348623157e308 || num > 1.7976931348623157e308) {
          throw new Error(`Number out of range for FLOAT8 data type: ${num}`);
        }
      }
      break;

    case 'SMALLSERIAL':
      if (Number.isInteger(num)) {
        if (num < 1 || num > 32767) {
          throw new Error(`Number out of range for SMALLSERIAL data type: ${num}`);
        }
      }
      break;

    case 'BIGSERIAL':
      if (Number.isInteger(num)) {
        if (num < 1 || num > 2147483647) {
          throw new Error(`Number out of range for SERIAL data type: ${num}`);
        }
      }
      break;

    case 'BIGSERIAL':
      if (Number.isInteger(num)) {
        if (num < 1 || num > 9223372036854775807) {
          throw new Error(`Number out of range for BIGSERIAL data type: ${num}`);
        }
      }
      break;

    case 'BIGINT':
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
    case 'DATE':
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date.toISOString())) {
        throw new Error(`Invalid format for DATE data type: ${date.toISOString()}`);
      }
      break;

    case 'TIMESTAMP':
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date.toISOString())) {
        throw new Error(`Invalid format for TIMESTAMP data type: ${date.toISOString()}`);
      }
      break;

    case 'TIMESTAMPTZ':
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date.toISOString())) {
        throw new Error(`Invalid format for TIMESTAMPTZ data type: ${date.toISOString()}`);
      }
      break;

    default:
      throw new TypeError(`Invalid data type: ${type}`);
  }

  return date.toISOString();
};

// try {
//   const date = new Date();
//   const type = 'DATE';
//   const sql = convertToSqlDate(date, type);
//   console.log(sql);
//   // Output: '2020-07-27T00:00:00.000Z'
// } catch (error) {
//   console.error(error);
// }
