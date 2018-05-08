'use strict';

import logger from './logger';

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE__');
  logger.log(logger.ERROR, error);
  // Zachary - I know I might have the property error.status

  if (error.status) {
    logger.log(logger.INFO, `Responding with a ${error.status} code and message ${error.message}`);
    return response.sendStatus(error.status);
  }
  //-----------------------------------------------------------------
  // Zachary - I know that if we are here, it's another type or error
  const errorMessage = error.message.toLowerCase();
  console.log('HEY LOOK HERER FOR ERROR', errorMessage);

  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.INFO, 'Responding with a 404 code');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    logger.log(logger.INFO, 'Responding with a 400 code');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.INFO, 'Responding with a 409 code');
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.INFO, 'Responding with a 401 code');
    return response.sendStatus(401);
  }
  //-----------------------------------------------------------------
  logger.log(logger.ERROR, 'Responding with a 500 error code');
  logger.log(logger.ERROR, error);
  return response.sendStatus(500);
};