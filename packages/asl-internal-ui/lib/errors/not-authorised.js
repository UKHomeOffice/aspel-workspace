class NotAuthorisedError extends Error {

  constructor(msg = 'Not Authorised') {
    super(msg);
    this.status = 403;
  }

}

module.exports = NotAuthorisedError;
