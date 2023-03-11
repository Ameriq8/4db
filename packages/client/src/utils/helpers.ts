import { IColumn, ISchema, TypesMap } from './interfaces';

export const validateDate = (date: Date, type: String) => {
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

export const parseModelSchema = (model: ISchema): ISchema => {
  const schema: ISchema = {};
  for (const [columnName, columnDefinition] of Object.entries(model)) {
    const {
      type,
      maxLength,
      unique,
      nullable,
      default: defaultValue,
    } = columnDefinition as IColumn;
    const column = {
      type,
      maxLength: maxLength ? maxLength : 0,
      unique: unique ? true : false,
      nullable: nullable ? true : false,
      default: defaultValue ? defaultValue : defineColumnDefaultValue(type),
    };
    schema[columnName] = column;
  }
  return schema;
};

export const defineColumnDefaultValue = (columnType: keyof TypesMap): any => {
  switch (columnType) {
    case 'string':
      return '';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'date':
      return new Date();
    case 'json':
      return {};
    case 'array':
      return [];
    case 'jsonb':
        return '';
    default:
      return null;
  }
};
