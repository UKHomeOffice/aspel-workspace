const assert = require('assert');
const createEmailChangeProof = require('../../lib/middleware/email-change-proof');

describe('email change proof', () => {
  let now;
  let store;
  let proof;
  let req;

  beforeEach(() => {
    now = 0;
    const records = new Map();
    store = {
      issueEmailProof: async (key, binding, ttl) => records.set(key, { binding, expires: now + ttl }),
      consumeEmailProof: async (key, binding) => {
        const record = records.get(key);
        if (!record || record.expires <= now || record.binding !== binding) {
          return false;
        }
        records.delete(key);
        return true;
      }
    };
    proof = createEmailChangeProof(store);
    req = {
      user: { id: 'user', profile: { email: 'old@example.com' }, _auth: { sid: 'session' } },
      body: { email: 'new@example.com' }
    };
  });

  it('expires after five minutes', async () => {
    const token = await proof.issue(req);
    now = 300000;
    req.body = { emailProof: token, data: { email: 'new@example.com' } };
    await assert.rejects(proof.consume(req), { status: 403 });
  });

  it('does not accept a proof for another account or changed original email', async () => {
    const token = await proof.issue(req);
    req.body = { emailProof: token, data: { email: 'new@example.com' } };
    req.user.id = 'other';
    await assert.rejects(proof.consume(req), { status: 403 });
    req.user.id = 'user';
    req.user.profile.email = 'changed@example.com';
    req.body.emailProof = token;
    await assert.rejects(proof.consume(req), { status: 403 });
  });

  it('requires an authenticated session claim', async () => {
    req.user._auth = {};
    await assert.rejects(proof.issue(req), { status: 400 });
  });

  it('fails closed without a Redis store', async () => {
    await assert.rejects(createEmailChangeProof(null).issue(req), { status: 503 });
    req.body = { emailProof: 'a'.repeat(64), data: { email: 'new@example.com' } };
    await assert.rejects(createEmailChangeProof(null).consume(req), { status: 503 });
  });

  it('fails closed when the Redis store errors', async () => {
    store.issueEmailProof = async () => { throw new Error('Redis unavailable'); };
    await assert.rejects(proof.issue(req), { status: 503 });
    store.consumeEmailProof = async () => { throw new Error('Redis unavailable'); };
    req.body = { emailProof: 'a'.repeat(64), data: { email: 'new@example.com' } };
    await assert.rejects(proof.consume(req), { status: 503 });
  });

  it('does not accept two concurrent uses', async () => {
    const token = await proof.issue(req);
    const request = () => ({
      user: req.user,
      body: { emailProof: token, data: { email: 'new@example.com' } }
    });
    const results = await Promise.allSettled([proof.consume(request()), proof.consume(request())]);
    assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
    assert.equal(results.filter(result => result.status === 'rejected').length, 1);
  });
});
