import { Client } from './Client';
import { model } from './Model';

const client = new Client({
  host: 'localhost',
  port: 3002,
  database: '4db',
  username: 'postgres',
  password: 'Ameriq81',
});

export default client;
