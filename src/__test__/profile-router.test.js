'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock, pCreateProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles should get a 200 and the newly created profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'I code all day, every day',
            firstName: 'Zachary',
            lastName: 'Schumpert',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Zachary');
        expect(response.body.lastName).toEqual('Schumpert');
        expect(response.body.bio).toEqual('I code all day, every day');
      });
  });
  test('POST - 404 due to no route found', () => {
    return superagent.post(apiURL)
      .send({
        username: 'zachary',
        password: 'doggy',
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(404);
      });
  });
  test('POST - It should respond with a 400 status', () => {
    const mockProfilePost = {
      username: faker.lorem.words(50),
      password: faker.lorem.words(25),
    };
    return superagent.post(`${apiURL}/profiles`)
      .send(mockProfilePost)
      .then(Promise.reject) // Zachary this is needed because we are testing failures
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('POST 401 due to bad token or lack of token', () => {
    return superagent.post(`${apiURL}/profiles`)
      .set('Authorization', 'Bearer 1234')
      .send({
        bio: 'I code all day, every day',
        firstName: 'Zachary',
        lastName: 'Schumpert',
      })
      .catch((error) => {
        expect(error.status).toEqual(401);
      });
  });
});

describe('GET /profiles', () => {
  test.only('should respond with 200 if there are no errors', () => {
    let accountMock = null; // Zachary - preserving the dinosaur because of scope rules
    return pCreateAccountMock() // Zachary - test only a GET request 
      .then((mockProfilePost) => {
        accountMock = mockProfilePost;
        return superagent.get(`${apiURL}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.firstName).toEqual(accountMock.firstName);
        expect(response.body.lastName).toEqual(accountMock.lastName);
        expect(response.body.bio).toEqual(accountMock.bio);
        expect(response.body._id).toBeTruthy();
      });
  });
});
