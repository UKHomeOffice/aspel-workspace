const assert = require('assert');
const { isValidToken } = require('../../lib/routers/invitation');

const invitation = { email: 'Test@example.com', establishmentId: 8201, role: 'admin' };

const makeToken = claims => {
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${encode({ alg: 'HS256' })}.${encode(claims)}.signature`;
};

const now = () => Math.floor(Date.now() / 1000);

describe('invitation token validation', () => {
  const claims = { email: 'test@example.com', establishmentId: 8201, role: 'admin' };

  it('accepts an unexpired token matching the invitation', () => {
    assert.equal(isValidToken(makeToken({ ...claims, exp: now() + 60 }), invitation), true);
  });

  it('rejects an expired token', () => {
    assert.equal(isValidToken(makeToken({ ...claims, exp: now() - 1 }), invitation), false);
  });

  it('rejects a token with no expiry', () => {
    assert.equal(isValidToken(makeToken(claims), invitation), false);
  });

  it('rejects a token whose claims do not match the invitation', () => {
    const exp = now() + 60;
    assert.equal(isValidToken(makeToken({ ...claims, exp, role: 'basic' }), invitation), false);
    assert.equal(isValidToken(makeToken({ ...claims, exp, establishmentId: 1 }), invitation), false);
    assert.equal(isValidToken(makeToken({ ...claims, exp, email: 'other@example.com' }), invitation), false);
  });

  it('rejects malformed tokens', () => {
    assert.equal(isValidToken('abcdef', invitation), false);
  });
});
