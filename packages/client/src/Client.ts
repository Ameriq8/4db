import postgres from 'postgres';
import Logger from './Logger';
import { parsePostgresUrl } from './utils';
import { IConnectionDetails } from './utils/interfaces';

export class Client {
  public logger: Logger;

  private host: string;
  private port: number;
  private database: string;
  private username: string;
  private password: string;

  public sql: postgres.Sql<{}>;

  constructor(connectionDetails: IConnectionDetails | string) {
    this.logger = Logger.getLogger();
    if (typeof connectionDetails === 'string') {
      const parsedUrl = parsePostgresUrl(connectionDetails);
      this.host = parsedUrl.host;
      this.port = parsedUrl.port;
      this.database = parsedUrl.database;
      this.username = parsedUrl.username;
      this.password = parsedUrl.password;
    } else {
      this.host = connectionDetails.host;
      this.port = connectionDetails.port;
      this.database = connectionDetails.database;
      this.username = connectionDetails.username;
      this.password = connectionDetails.password;
    }
    this.connect();
  }

  private getConnectionDetails(): IConnectionDetails {
    return {
      host: this.host,
      port: this.port,
      database: this.database,
      username: this.username,
      password: this.password,
    };
  }

  private connect(): void {
    this.logger.info('Connecting to postgresql database...');
    this.sql = postgres(this.getConnectionDetails());
    Logger.getLogger().success('4Database connected');
  }

  public async query(query: string): Promise<any> {
    console.log(this.sql`${query}`)
    await this.sql`${query}`;
  }
}
