'use strict';

const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const supertest = require('supertest');
const request = supertest(server);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

///just some dummy data for an account
const frank = {
  username: 'Frank',
  password: 'unSALTed',
};

describe('users', () => {
  describe('authentication', () => {
    it('rejects lack of auth', async () => {
      //create frank
      await request.post('/signup').send(frank);

      //sign into frank, but you didn't authorize!
      const response = await request.put('/signin');
      expect(response.status).toBe(403);
    });
  });
  describe('routes', () => {
    it('can create a user', async () => {
      const response = await request.post('/signup').send(frank);
      expect(response.status).toBe(200);
      expect(response.text).toBe('New account created, Frank!');
    });
    it('can sign into a user', async () => {
      //create frank
      await request.post('/signup').send(frank);

      //sign into frank, with authorization
      const response = await request.put('/signin').send(frank);
      console.log(response.text);
      expect(response.status).toBe(200);
      expect(response.body.username).toBe('Frank');
    });
  });
});
