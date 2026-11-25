class RateLimitedError extends Error {

  constructor(retryAfter = 60) {
    super('Rate limit exceeded');
    this.status = 429;
    this.retryAfter = retryAfter;
  }

}

module.exports = RateLimitedError;
