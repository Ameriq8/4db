import chalk from 'chalk';
import symbols from 'log-symbols';
import { ILogger } from './utils/interfaces';

export default class Logger implements ILogger {
  private static instance: Logger;

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

  static getLogger(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}
