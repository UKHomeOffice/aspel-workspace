class NotFoundError extends Error {

  constructor(msg = 'Not Found') {
    super(msg);
    this.status = 404;
  }

}

module.exports = NotFoundError;
