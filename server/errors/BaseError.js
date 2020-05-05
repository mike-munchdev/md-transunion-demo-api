class BaseError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = 500;
    this.name = this.constructor.name;
    this.errorHandler = this.name;
    this.stack = (new Error()).stack;
  }

  toJSON() {
    const payload = {
      message: this.message,
      errorHandler: this.errorHandler,
    };
    return payload;
  }
}

module.exports = BaseError;
