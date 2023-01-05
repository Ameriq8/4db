import chalk from 'chalk';
import figlet from 'figlet';
import symbols from 'log-symbols';
import { ILogger } from './utils/index';

export default class AdvancedLogger implements ILogger {
  private static instance: AdvancedLogger;

  success(message: string): void {
    console.log(symbols.success, chalk.green.bold(message));
  }

  error(message: string): void {
    console.log(symbols.error, chalk.red.bold(message));
  }

  warning(message: string): void {
    console.log(symbols.warning, chalk.gray.bold(message));
  }

  info(message: string): void {
    console.log(symbols.info, chalk.blueBright.bold(message));
  }

  debug(data: any): void {
    console.log(data);
  }

  logo(): void {
    console.log(chalk.blueBright.bold(figlet.textSync('4Database')))
  }

  static getLogger(): AdvancedLogger {
    if (!AdvancedLogger.instance) {
      AdvancedLogger.instance = new AdvancedLogger();
    }
    return AdvancedLogger.instance;
  }
}
