const { ServerError } = require('../errors');
const logger = require('./logger');

const log = logger('meredian-api');

const wrapErrors = fn => (...args) => fn(...args).catch(args[2]);

const filterError = (err) => {
  const recognizedErrors = ['Unauthorized', 'APIError'];
  if (recognizedErrors.indexOf(err.name) === -1) {
    return new ServerError(err);
  }
  return err;
};

const errorObject = (errMsg, errorBody, errorStatus) => {
  const errorData = {
    message: errMsg,
    error: errorBody,
    status: errorStatus,
  };

  return errorData;
}

const noticeError = (err) => {
  log.error(err);
};

// next is required in the function signature for the middleware
// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = log => async (err, req, res, next) => {
  const error = filterError(err);
  try {
    log.error({
      error,
      stack: error.stack,
      userId: req.authenticatedUserId,
      message: `Error encountered (${error.name}) - ${error.message}`,
    });
  } catch (fatalErr) {
    console.log(error);
    console.log(fatalErr);
  }

  return res.status(error.statusCode).send({ message: error.message });
};

module.exports = { wrapErrors, filterError, errorObject, noticeError, errorHandlerMiddleware };
