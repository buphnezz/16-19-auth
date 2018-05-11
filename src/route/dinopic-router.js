'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleWare from '../lib/bearer-auth';
import Dinopic from '../model/dinopic';
import { s3Upload, s3Remove } from '../lib/s3';

const multerUpload = multer({ dest: `${__dirname}/../temp` });
const dinopicRouter = new Router();

dinopicRouter.post('/dinopics', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'DINOPIC ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'dinopic') {
    return next(new HttpError(400, 'DINOPIC ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      return new Dinopic({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(dinopic => response.json(dinopic))
    .catch(next);
});

export default dinopicRouter;
