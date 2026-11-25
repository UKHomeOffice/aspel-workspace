const crypto = require('crypto');
const { UnauthorisedError, BadRequestError } = require('../errors');

const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const sessionId = req => req.user._auth && (req.user._auth.sid || req.user._auth.session_state);
const unavailable = cause => Object.assign(new Error('Email change verification is unavailable'), { status: 503, cause });

const createEmailChangeProof = store => {
  const issue = async req => {
    const email = req.body.email;
    const session = sessionId(req);
    if (typeof email !== 'string' || !email || !session) {
      throw new BadRequestError('Email and authenticated session are required');
    }
    if (!store) {
      throw unavailable();
    }
    const token = crypto.randomBytes(32).toString('hex');
    try {
      await store.issueEmailProof(digest(token), digest(JSON.stringify([req.user.id, session, req.user.profile.email, email])), 300000);
    } catch (error) {
      throw unavailable(error);
    }
    return token;
  };

  const consume = async req => {
    const { emailProof } = req.body;
    delete req.body.emailProof;
    const email = req.body.data && req.body.data.email;
    const session = sessionId(req);
    if (typeof emailProof !== 'string' || !/^[a-f0-9]{64}$/.test(emailProof) ||
        typeof email !== 'string' || !session) {
      throw new UnauthorisedError();
    }
    if (!store) {
      throw unavailable();
    }
    let valid;
    try {
      valid = await store.consumeEmailProof(
        digest(emailProof),
        digest(JSON.stringify([req.user.id, session, req.user.profile.email, email]))
      );
    } catch (error) {
      throw unavailable(error);
    }
    if (!valid) {
      throw new UnauthorisedError();
    }
  };

  return { issue, consume };
};

module.exports = createEmailChangeProof;
