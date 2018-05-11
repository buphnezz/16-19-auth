'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateDinopicMock, pRemoveDinopicMock } from './lib/dinopic-mock';

// set this to true or false depending on if you want to hit the mock AWS-SDK or 
// if you want to hit the real AWS-SDK, i.e., upload an asset to your real bucket

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /dinopics', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveDinopicMock);

  describe('POST 200 for successfull post /dinopics', () => {
    test('should return 200 for successful dinopics post', () => {
      // only do this if you have a slow computer AND you want to make a real API call to S3
      jest.setTimeout(20000);
      return pCreateDinopicMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock.token;
          return superagent.post(`${apiUrl}/dinopics`) 
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'dino roars')
            .attach('dinopic', `${__dirname}/asset/dinopic.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('dino roars');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.status, 'CODE ERR IN TEST');
          expect(err.status).toEqual(200);
        });
    });
    test('should return 400 on bad request', () => {
      return pCreateDinopicMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/dinopic`)
            .set('Authorization', `Bearer ${token}`)
            .attach('dinopic', `${__dirname}/asset/dinopic.jpg`)
            .then(Promise.reject);
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });
});
