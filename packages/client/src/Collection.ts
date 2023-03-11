import * as fs from 'fs';
import { ICollection, ICreateInput, ISchema, IUpdateInput, IWhereInput, TypesMap } from './utils';

export class Collection<T extends ISchema> implements ICollection {
  private filePath: string;
  private collection: { schema: T; data: any[] };
  private collectionName: string;

  constructor(filePath: string, collection: { collectionName: string; schema: T; data: any[] }) {
    this.filePath = filePath;
    this.collection = { schema: collection.schema, data: collection.data };
    this.collectionName = collection.collectionName;
  }

  async getAll(): Promise<unknown[]> {
    return this.collection.data;
  }

  async findMany(whereInput: IWhereInput<T>): Promise<unknown[]> {
    const { where } = whereInput || {};
    const results: any[] = [];

    if (!where || Object.keys(where).length === 0) return this.collection.data;

    for (const doc of this.collection.data) {
      let match = true;
      for (const field in where) {
        if (where.hasOwnProperty(field)) {
          const value = where[field];
          if (!doc.hasOwnProperty(field) || doc[field] !== value) {
            match = false;
            break;
          }
        }
      }

      if (match) results.push(doc);
    }

    return results;
  }

  async findOne(findOneOptions: IWhereInput<T>): Promise<unknown> {
    const { where } = findOneOptions;

    for (const doc of this.collection.data) {
      let match = true;
      for (const field in where) {
        if (where.hasOwnProperty(field)) {
          const value = where[field];
          if (!doc.hasOwnProperty(field) || doc[field] !== value) {
            match = false;
            break;
          }
        }
      }

      if (match) return doc;
    }

    return null;
  }

  async create(createInput: ICreateInput<T>): Promise<unknown> {
    const { data } = createInput;

    for (const field in this.collection.schema) {
      if (this.collection.schema.hasOwnProperty(field)) {
        const fieldSchema = this.collection.schema[field];

        if (data[field] === undefined) {
          if (fieldSchema.default !== undefined) {
            data[field] = fieldSchema.default;
          } else if (!fieldSchema.nullable) {
            throw new Error(`Field '${field}' must be defined`);
          }
        } else if (!this.validateType(data[field], fieldSchema.type)) {
          throw new Error(`Field '${field}' must be of type '${fieldSchema.type}'`);
        }
      }
    }

    this.collection.data.push(data);
    this.saveData();

    return data;
  }

  async update(updateInput: IUpdateInput<T>): Promise<unknown> {
    const { where, data } = updateInput;
    const doc = (await this.findOne({ where })) as any;

    if (!doc) return null;

    for (const field in data) {
      if (data.hasOwnProperty(field)) {
        if (!this.collection.schema.hasOwnProperty(field)) {
          throw new Error(`Field '${field}' does not exist in schema`);
        } else if (!this.validateType(data[field], this.collection.schema[field].type)) {
          throw new Error(
            `Field '${field}' must be of type '${this.collection.schema[field].type}'`,
          );
        }
        doc[field] = data[field];
      }
    }

    const index = this.collection.data.findIndex((item) => item.id === doc.id);

    if (index === -1) return null;

    this.collection.data[index] = doc;
    this.saveData();

    return doc;
  }

  async delete(deleteInput: IWhereInput<T>): Promise<unknown> {
    const { where } = deleteInput;
    const doc = await this.findOne({ where });

    if (!doc) return null;

    const index = this.collection.data.indexOf(doc);
    this.collection.data.splice(index, 1);
    this.saveData();

    return doc;
  }

  private saveData() {
    const collections = this.loadData();
    collections[this.collectionName].data = this.collection.data;
    fs.writeFileSync(this.filePath, JSON.stringify(collections));
  }

  private validateType(value: any, type: keyof TypesMap) {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
      case 'integer':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return typeof value === 'string';
      case 'json':
        return value instanceof Object;
      case 'jsonb':
        return value instanceof String;
      case 'array':
        return Array.isArray(value);
      default:
        return false;
    }
  }

  private loadData() {
    const json = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(json);
  }
}
