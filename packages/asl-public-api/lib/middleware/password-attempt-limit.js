const crypto = require('crypto');
const redis = require('redis');
const { RateLimitedError } = require('../errors');

const createRedisStore = ({ redisHost, redisPort, password }) => {
  const client = redis.createClient({
    socket: { host: redisHost, port: redisPort },
    disableOfflineQueue: true,
    password
  });

  client.on('error', err => {
    console.error('Password attempt limiter Redis error', err);
  });

  client.connect().catch(err => {
    console.error('Unable to connect password attempt limiter to Redis', err);
  });

  return {
    client,
    issueEmailProof: async (tokenHash, binding, ttl) => {
      await client.set(`email-change-proof:${tokenHash}`, binding, { PX: ttl });
    },
    consumeEmailProof: async (tokenHash, binding) => {
      const result = await client.eval(`
        if redis.call('GET', KEYS[1]) == ARGV[1] then
          redis.call('DEL', KEYS[1])
          return 1
        end
        return 0
      `, { keys: [`email-change-proof:${tokenHash}`], arguments: [binding] });
      return result === 1;
    },
    reserve: async (accountId, maxAttempts, windowMs) => {
      const key = `rate-limit:password-verify:${crypto.createHash('sha256').update(accountId).digest('hex')}`;
      const result = await client.eval(`
        local count = tonumber(redis.call('GET', KEYS[1]) or '0')
        local ttl = redis.call('PTTL', KEYS[1])
        if count >= tonumber(ARGV[1]) then
          return {0, ttl}
        end
        count = redis.call('INCR', KEYS[1])
        if count == 1 then
          redis.call('PEXPIRE', KEYS[1], ARGV[2])
          ttl = tonumber(ARGV[2])
        else
          ttl = redis.call('PTTL', KEYS[1])
        end
        return {1, ttl}
      `, {
        keys: [key],
        arguments: [String(maxAttempts), String(windowMs)]
      });

      return {
        allowed: result[0] === 1,
        retryAfter: Math.max(1, Math.ceil(result[1] / 1000))
      };
    },
    reset: async accountId => {
      const key = `rate-limit:password-verify:${crypto.createHash('sha256').update(accountId).digest('hex')}`;
      await client.del(key);
    }
  };
};

const createPasswordAttemptLimiter = ({ store, maxAttempts = 5, windowMs = 15 * 60 * 1000 }) => {
  return (req, res, next) => {
    const accountId = req.user.id;
    const endpoint = `${req.baseUrl}${req.route.path}`;
    const resetLimit = () => {
      if (!store) {
        return Promise.resolve();
      }
      return Promise.resolve()
        .then(() => store.reset(accountId))
        .catch(err => {
          req.log('error', {
            message: 'Unable to reset password attempt limit',
            endpoint,
            error: err.message
          });
        });
    };

    Promise.resolve()
      .then(() => {
        if (!store) {
          req.log('error', {
            message: 'Password attempt limiter is not configured',
            endpoint
          });
          return null;
        }
        return store.reserve(accountId, maxAttempts, windowMs);
      })
      .then(result => {
        if (result && !result.allowed) {
          const account = crypto.createHash('sha256').update(accountId).digest('hex');
          req.log('warn', {
            message: 'Password verification rate limit exceeded',
            ip: req.ip,
            endpoint,
            account,
            timestamp: new Date().toISOString(),
            retryAfter: result.retryAfter
          });
          return next(new RateLimitedError(result.retryAfter));
        }
        req.resetPasswordAttemptLimit = resetLimit;
        next();
      })
      .catch(err => {
        req.log('error', {
          message: 'Password attempt limiter failed; relying on Keycloak brute-force protection',
          endpoint,
          error: err.message
        });
        req.resetPasswordAttemptLimit = () => Promise.resolve();
        next();
      });
  };
};

module.exports = {
  createRedisStore,
  createPasswordAttemptLimiter
};
