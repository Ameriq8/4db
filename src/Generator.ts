import { IGenerator, ProviderType } from './utils/index';
import Prompter from './Prompter';
import FileManager from './FileManager';
import path from 'path';
import AdvancedLogger from './Logger';
import { execSync } from 'child_process';

export default class Generator implements IGenerator {
  private prompter: Prompter = Prompter.getPrompter();
  private fileManager: FileManager = FileManager.getFileManager();
  private logger: AdvancedLogger = AdvancedLogger.getLogger();

  async init(): Promise<void> {
    const provider: ProviderType = await this.prompter.provider();
    const databaseUrl: string = await this.prompter.databaseUrl();
    const config = { database: databaseUrl, provider };
    const basePath: string = path.join(this.fileManager.getCurrentDir());

    this.logger.success('4DB Files Generator start...');

    await this.fileManager.createConfig(config);
    await this.fileManager.createDirectory('models');
    await this.fileManager.createFile(path.join(basePath, 'models', 'start.js'), '// Hello World');

    this.logger.success('4DB Files Generator created all required files.');
    this.logger.info('4DB Package Mananger start installing all required packages.');

    execSync('npm install @4db/client', {
      cwd: basePath,
      stdio: 'ignore',
    });

    this.logger.success('4DB Package Manager installed all required packages.');
  }

  async createModel(file: string): Promise<void> {
    const dir = this.fileManager.getCurrentDir();
    const modelsDir = path.join(dir, 'models', file);
    const exists = await this.fileManager.exists(modelsDir);
    if (exists) {
      await this.fileManager.createFile(modelsDir, '// Hello World');
    } else {
      await this.fileManager.createDirectory('models');
      await this.fileManager.createFile(path.join(dir, 'models', file), '// Hello World');
    }
  }

  public getPrompter(): Prompter {
    return this.prompter;
  }

  public getFileManager(): FileManager {
    return this.fileManager;
  }
}
