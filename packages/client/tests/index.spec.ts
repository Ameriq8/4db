import chai from 'chai';
import { describe } from 'mocha';
// import { v4 as uuid } from 'uuid';
import { Client } from '../src/index';

describe('4DB Client', async () => {
  it('Create new connection to Postgresql database', () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });
    chai.expect(client).to.be.a('object');
  });

  it('Create new collection called users', async () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });

    client.insertCollection('users', {
      name: {
        type: 'string',
        nullable: false,
      },
      age: {
        type: 'number',
        nullable: false,
      },
    });
  });

  it('Create new collection called posts and create new data', async () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });

    client.insertCollection('posts', {
      id: {
        type: 'string',
        nullable: false,
        unique: true,
      },
      title: {
        type: 'string',
        nullable: false,
        maxLength: 255,
      },
      body: {
        type: 'string',
        nullable: false,
        maxLength: 1024,
      },
    });

    await client
      .getCollection('posts')
      .create({
        data: {
          id: '5f0f8c9f-5f3f-4b1c-b8c3-6d8a8a8a8a8a' /*uuid()*/,
          title: 'Post 1',
          body: 'This is post 1',
        },
      })
      .then((d) => console.log(d));
  });

  it('Updating post data', async () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });

    await client
      .getCollection('posts')
      .update({
        where: {
          id: '5f0f8c9f-5f3f-4b1c-b8c3-6d8a8a8a8a8a',
        },
        data: {
          title: 'New Post',
          body: 'This is post 1',
        },
      })
      .then((d) => console.log(d));
  });

  it('Deleting post data', async () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });

    await client
      .getCollection('posts')
      .delete({
        where: {
          title: 'New Post',
        },
      })
      .then((d) => console.log(d));
  });

  it('Find post data', async () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });

    await client
      .getCollection('posts')
      .findOne({
        where: {
          id: '5f0f8c9f-5f3f-4b1c-b8c3-6d8a8a8a8a8a',
        },
      })
      .then((d) => console.log(d));
  });

  it('Find Many post data', async () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });

    await client
      .getCollection('posts')
      .findMany({
        where: {
          title: 'New Post',
        },
      })
      .then((d) => console.log(d));
  });

  it('Get all post data', async () => {
    const client = new Client({ filePath: 'base.json', driver: 'json' });

    await client
      .getCollection('posts')
      .getAll()
      .then((d) => console.log(d));
  });
});
