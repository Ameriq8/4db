import { FourDBConfig, ProviderType } from './types';

export interface Initializer {
  initialize(...args: any): void;
}

export interface ILogger {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  debug(data: any): void;
  logo(): void;
}

export interface IPrompter {
  provider(): Promise<ProviderType>;
  databaseUrl(): Promise<string>;
  getStartUpQuestion(): Promise<string>;
}

export interface IFileManager {
  createConfig(config: FourDBConfig): Promise<void>;
  createDirectory(dirName: string): Promise<void>;
  createFile(filePath: string, data: string): Promise<void>;
  getCurrentDir(): string;
  getFileToJson(filePath: string): Promise<any>;
  findFile(filePath: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
}

export interface IGenerator {
  init(): Promise<void>;
  createModel(file: string): Promise<void>;
}
