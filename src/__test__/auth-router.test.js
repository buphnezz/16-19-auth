'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveAccountMock, pCreateAccountMock } from './lib/account-mock';


const apiURL = `http://localhost:${process.env.PORT}/signup`;


describe('AUTH ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(apiURL)
      .send({
        username: 'houd',
        email: 'hound@gregor.com',
        password: 'hound',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('400 due to bad request', () => {
    return superagent.post(apiURL)
      .send({
        username: 'zachary',
        password: 'doggy',
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });
  test('409 due to duplicate videoconsole', () => {
    return pCreateAccountMock()
      .then((account) => {
        const mockAccount = {
          username: account.request.username,
          password: account.request.password,
          email: account.request.email,
        };
        return superagent.post(apiURL)
          .send(mockAccount);
      })
      .then((response) => {
        Promise.reject(response);
      })
      .catch((err) => {
        expect(err.status).toEqual(409);
      });
  });
});
