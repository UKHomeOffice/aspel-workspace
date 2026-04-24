'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const cachebuster = require('../../../lib/middleware/profile-cachebuster');

describe('profile-cachebuster middleware', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: 'GET',
      session: { profile: {} },
      user: {
        refreshProfile: () => Promise.resolve()
      }
    };
    res = {};
  });

  it('returns a middleware function', () => {
    const middleware = cachebuster();
    assert.strictEqual(typeof middleware, 'function');
  });

  describe('GET requests', () => {
    it('calls next() immediately if profile is not stale', async () => {
      req.method = 'GET';
      req.session.profile.stale = false;

      await new Promise((resolve) => {
        cachebuster()(req, res, resolve);
      });
    });

    it('calls next() immediately if profile.stale is undefined', async () => {
      req.method = 'GET';

      await new Promise((resolve) => {
        cachebuster()(req, res, resolve);
      });
    });

    it('calls refreshProfile and then next() if profile is stale', async () => {
      req.method = 'GET';
      req.session.profile.stale = true;
      let refreshCalled = false;

      req.user.refreshProfile = () => {
        refreshCalled = true;
        return Promise.resolve();
      };

      await new Promise((resolve) => {
        cachebuster()(req, res, resolve);
      });

      assert.strictEqual(refreshCalled, true);
    });

    it('passes the error to next() if refreshProfile rejects', async () => {
      req.method = 'GET';
      req.session.profile.stale = true;
      const expectedError = new Error('refresh failed');

      req.user.refreshProfile = () => Promise.reject(expectedError);

      const receivedError = await new Promise((resolve) => {
        cachebuster()(req, res, resolve);
      });

      assert.strictEqual(receivedError, expectedError);
    });

    it('does not mark the profile as stale for GET requests', async () => {
      req.method = 'GET';
      req.session.profile.stale = false;

      await new Promise((resolve) => {
        cachebuster()(req, res, resolve);
      });

      assert.strictEqual(req.session.profile.stale, false);
    });
  });

  describe('non-GET requests', () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      it(`marks the profile as stale for ${method} requests`, async () => {
        req.method = method;
        req.session.profile.stale = false;

        await new Promise((resolve) => {
          cachebuster()(req, res, resolve);
        });

        assert.strictEqual(req.session.profile.stale, true);
      });
    }

    it('calls next() for non-GET requests without calling refreshProfile', async () => {
      req.method = 'POST';
      let refreshCalled = false;

      req.user.refreshProfile = () => {
        refreshCalled = true;
        return Promise.resolve();
      };

      await new Promise((resolve) => {
        cachebuster()(req, res, resolve);
      });

      assert.strictEqual(refreshCalled, false);
    });

    it('marks the profile as stale even when profile.stale is already true', async () => {
      req.method = 'POST';
      req.session.profile.stale = true;

      await new Promise((resolve) => {
        cachebuster()(req, res, resolve);
      });

      assert.strictEqual(req.session.profile.stale, true);
    });
  });
});
