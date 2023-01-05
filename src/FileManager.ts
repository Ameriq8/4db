import { promises as fs } from 'fs';
import path from 'path';
import { FourDBConfig, IFileManager } from './utils/index';

export default class FileManager implements IFileManager {
  private static instance: FileManager;
  private CURRENT_DIR: string = process.cwd();

  createConfig(config: FourDBConfig): Promise<void> {
    try {
      return fs.writeFile(
        path.join(this.CURRENT_DIR, '4db.json'),
        JSON.stringify(config, null, 2),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  createDirectory(name: string): Promise<void> {
    try {
      return fs.mkdir(name);
    } catch (err) {
      throw new Error(err);
    }
  }

  createFile(filePath: string, data: string): Promise<void> {
    try {
      return fs.writeFile(filePath, data);
    } catch (err) {
      throw new Error(err);
    }
  }

  getCurrentDir(): string {
    return this.CURRENT_DIR;
  }

  async getFileToJson(filePath: string): Promise<any> {
    try {
      const text = await fs.readFile(filePath, 'utf8');
      return JSON.parse(text);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findFile(filePath: string): Promise<void> {
    try {
      await fs.access(filePath);
    } catch (err) {
      throw new Error(`${filePath} was not found.`);
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  static getFileManager(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }
}
