const BaseError = require('./BaseError');

class ServerError extends BaseError {
  constructor(err) {
    super();
    this.message = err.errmsg || err.messages || err.message || 'Unknown Server Error';
    this.statusCode = this.getStatusCode(err);
    this.name = err.constructor || 'ServerError';
    this.stack = err.stack;
  }

  getStatusCode(err) {
    switch (err.name) {
      case 'CastError':
        return 400;
      case 'ValidationError':
        return 400;
      case 'ValidatorError':
        return 400;
      case 'MongoError':
        return 400;
      default:
        return 500;
    }
  }
}

module.exports = ServerError;
