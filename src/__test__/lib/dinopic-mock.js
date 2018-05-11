'use strict';

import faker from 'faker';
import { pCreateAccountMock, pRemoveAccountMock } from '../lib//account-mock';
import Dinopic from '../../model/dinopic';
import Account from '../../model/account';

const pCreateDinopicMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock = mockAcctResponse;

      return new Dinopic({
        title: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((dinopic) => {
      resultMock.dinopic = dinopic;
      return resultMock;
    });
};

const pRemoveDinopicMock = () => Promise.all([Account.remove({}), Dinopic.remove({})]);

export { pCreateDinopicMock, pRemoveDinopicMock };
