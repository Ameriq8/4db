import fs from 'fs';
import { Collection } from './Collection';
import { DriverTypes } from './utils';
import { parseModelSchema } from './utils/helpers';
import { IClientOptions, ISchema } from './utils/interfaces';

export class Client {
  private driver: DriverTypes = 'json';
  private filePath: string;
  private data: { [key: string]: { schema: ISchema; data: any[] } };

  constructor(clientOptions: IClientOptions) {
    this.driver = clientOptions.driver;
    this.filePath = clientOptions.filePath;

    this.checkClientOptions();
    this.loadData();
  }

  private getClientOptions(): IClientOptions {
    return {
      driver: this.driver,
      filePath: this.filePath,
    };
  }

  private checkClientOptions() {
    if (!this.getClientOptions()) throw new Error('Invalid client options');
    if (!this.driver) throw new Error('Invalid driver');
    if (!this.filePath) throw new Error('Invalid file path');

    const pathExists = this.pathExists();
    if (!pathExists) throw new Error('File path does not exist');
  }

  private pathExists() {
    return new Promise((resolve, _reject) => {
      fs.access(this.filePath, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  private loadData() {
    const json = fs.readFileSync(this.filePath, 'utf-8');
    this.data = JSON.parse(json);
  }

  private saveCollection() {
    const json = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(this.filePath, json);
  }

  public insertCollection(collectionName: string, collectionSchema: ISchema) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = {
        schema: parseModelSchema(collectionSchema),
        data: [],
      };
    } else {
      this.data[collectionName].schema = parseModelSchema(collectionSchema);
    }
    this.saveCollection();
  }

  public getCollection(collectionName: string) {
    const collectionData = this.data[collectionName].data;
    const collectionSchema = this.data[collectionName].schema;
    if (!collectionData || !collectionSchema) {
      throw new Error(`Collection ${collectionName} does not exist`);
    }
    const collection = {
      collectionName,
      schema: collectionSchema,
      data: collectionData,
    };
    return new Collection(this.filePath, collection);
  }
}
