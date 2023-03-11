import * as fs from 'fs';

type Schema = { [key: string]: { [key: string]: any } };

class JSONDB {
  private filePath: string;
  private data: { [key: string]: any };
  private schema: Schema;

  constructor(filePath: string, schema?: Schema) {
    this.filePath = filePath;
    this.schema = schema || {};
    this.loadData();
  }

  private loadData() {
    const json = fs.readFileSync(this.filePath, 'utf-8');
    this.data = JSON.parse(json);
  }

  private saveData() {
    const json = JSON.stringify(this.data);
    fs.writeFileSync(this.filePath, json);
  }

  public addCollection(collectionName: string, collectionSchema: { [key: string]: any }) {
    this.schema[collectionName] = collectionSchema;
    this.data[collectionName] = [];
    this.saveData();
  }

  public getCollection(collectionName: string) {
    const collectionData = this.data[collectionName];
    const collectionSchema = this.schema[collectionName];
    if (!collectionData || !collectionSchema) {
      throw new Error(`Collection ${collectionName} does not exist`);
    }
    return new Collection(this.filePath, collectionData, collectionSchema);
  }
}

class Collection {
  private filePath: string;
  private data: any[];
  private schema: { [key: string]: any };

  constructor(filePath: string, data: any[], schema: { [key: string]: any }) {
    this.filePath = filePath;
    this.data = data;
    this.schema = schema;
  }

  public insert(doc: { [key: string]: any }) {
    doc._id = this.generateId();
    for (const field in this.schema) {
      if (this.schema.hasOwnProperty(field)) {
        if (doc[field] === undefined) {
          if (this.schema[field].default !== undefined) {
            doc[field] = this.schema[field].default;
          } else if (this.schema[field].required) {
            throw new Error(`Field '${field}' is required`);
          }
        } else if (!this.validateType(doc[field], this.schema[field].type)) {
          throw new Error(`Field '${field}' must be of type '${this.schema[field].type}'`);
        }
      }
    }
    this.data.push(doc);
    this.saveData();
    return doc;
  }

  public find(query: { [key: string]: any }) {
    const results: any = [];
    for (const doc of this.data) {
      let match = true;
      for (const field in query) {
        if (query.hasOwnProperty(field)) {
          if (!doc.hasOwnProperty(field) || doc[field] !== query[field]) {
            match = false;
            break;
          }
        }
      }
      if (match) {
        results.push(doc);
      }
    }
    return results;
  }

  public findOne(query: { [key: string]: any }) {
    const results = this.find(query);
    return results.length ? results[0] : null;
  }

  public update(query: { [key: string]: any }, changes: { [key: string]: any }) {
    const doc = this.findOne(query);
    if (!doc) {
      return null;
    }
    for (const field in changes) {
      if (changes.hasOwnProperty(field)) {
        if (!this.schema.hasOwnProperty(field)) {
          throw new Error(`Field '${field}' does not exist in schema`);
        } else if (!this.validateType(changes[field], this.schema[field].type)) {
          throw new Error(`Field '${field}' must be of type '${this.schema[field].type}'`);
        }
        doc[field] = changes[field];
      }
    }
    return doc;
  }

  public remove(query: { [key: string]: any }) {
    const doc = this.findOne(query);
    if (!doc) {
      return null;
    }
    this.data.splice(this.data.indexOf(doc), 1);
    return doc;
  }

  private validateType(value: any, type: string) {
    if (type === 'string') {
      return typeof value === 'string';
    } else if (type === 'number') {
      return typeof value === 'number';
    } else if (type === 'boolean') {
      return typeof value === 'boolean';
    } else if (type === 'object') {
      return value instanceof Object;
    } else if (type === 'array') {
      return Array.isArray(value);
    }
    return false;
  }

  private generateId() {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  public count(query: { [key: string]: any }) {
    return this.find(query).length;
  }

  private saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data));
  }
}

const jsonDB = new JSONDB('./base.json');
jsonDB.addCollection('users', {
  name: {
    type: 'string',
    required: true,
  },
  age: {
    type: 'number',
    required: true,
  },
});
jsonDB.addCollection('posts', {
  title: {
    type: 'string',
    required: true,
  },
  body: {
    type: 'string',
    required: true,
  },
});

jsonDB.getCollection('posts').insert({
  title: 'Post 1',
  body: 'This is post 1',
});
jsonDB.getCollection('posts').insert({
  title: 'Post 2',
  body: 'This is post 2',
});

console.log(jsonDB.getCollection('posts').find({}));
console.log(jsonDB.getCollection('users').find({}));
console.log(
  jsonDB.getCollection('posts').findOne({
    title: 'Post 1',
  }),
);
