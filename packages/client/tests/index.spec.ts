import chai from 'chai';
import { describe } from 'mocha';
import { Client, model } from '../src/index';

describe('4DB Client', async () => {
  it('Create new connection to Postgresql database', () => {
    let client = new Client({
      host: 'localhost',
      port: 3002,
      database: '4db',
      username: 'postgres',
      password: 'Ameriq81',
    });
    chai.expect(client).to.haveOwnProperty('sql');
  });

  it('Create new model called Users', async () => {
    let client = new Client({
      host: 'localhost',
      port: 3002,
      database: '4db',
      username: 'postgres',
      password: 'Ameriq81',
    });

    let UsersModel = await model(
      'users',
      {
        id: {
          type: 'uuid',
          primary: true,
          nullable: false,
          unique: true,
        },
        username: {
          type: 'character',
          nullable: true,
          maxLength: 255,
        },
      },
      client,
    );

    // await UsersModel.build()

    await UsersModel.create({ data: { username: 'AmerIQ' } });

    // console.log(
    //   await UsersModel.findOne({ where: { username: "AmerIQ" } }),
    // );
  });
});
