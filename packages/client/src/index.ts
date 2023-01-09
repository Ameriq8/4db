import { Client } from './Client';
import { model } from './Model';

const client = new Client({
  host: 'localhost',
  port: 3002,
  database: '4db',
  username: 'postgres',
  password: 'Ameriq81',
});

(async () => {
  const UserModel = await model('users', {
    id: {
      type: 'character',
      primary: true,
      nullable: false,
    },
    username: {
      type: 'character',
      nullable: true,
    },
  });

  UserModel.findOne({
    where: {
      id: 'tv',
      username: 'text',
    },
  }).then((t) => {
    console.log(t.id);
  });
})()

export default client;
