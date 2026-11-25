const assert = require('assert');
const request = require('supertest');
const apiHelper = require('../helpers/api');
const ids = require('../data/ids');

const createAttemptStore = () => {
  const attempts = new Map();
  const proofs = new Map();
  return {
    issueEmailProof: async (key, binding, ttl) => {
      proofs.set(key, { binding, expiresAt: Date.now() + ttl });
    },
    consumeEmailProof: async (key, binding) => {
      const proof = proofs.get(key);
      if (!proof || proof.expiresAt <= Date.now() || proof.binding !== binding) {
        return false;
      }
      proofs.delete(key);
      return true;
    },
    reserve: (accountId, maxAttempts, windowMs) => {
      const current = attempts.get(accountId) || { count: 0, expiresAt: Date.now() + windowMs };
      if (current.expiresAt <= Date.now()) {
        current.count = 0;
        current.expiresAt = Date.now() + windowMs;
      }
      if (current.count >= maxAttempts) {
        return Promise.resolve({
          allowed: false,
          retryAfter: Math.max(1, Math.ceil((current.expiresAt - Date.now()) / 1000))
        });
      }
      current.count += 1;
      attempts.set(accountId, current);
      return Promise.resolve({ allowed: true });
    },
    reset: accountId => {
      attempts.delete(accountId);
      return Promise.resolve();
    }
  };
};

describe('/me', () => {
  beforeEach(() => {
    this.passwordAttemptStore = createAttemptStore();
    return apiHelper.create({
      passwordAttemptLimit: {
        store: this.passwordAttemptStore,
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000
      }
    })
      .then(api => {
        this.api = api.api;
        this.workflow = api.workflow;
      });
  });

  afterEach(() => {
    return apiHelper.destroy();
  });

  describe('GET', () => {

    it('returns the logged in user', () => {
      return request(this.api)
        .get('/me')
        .expect(200)
        .expect(response => {
          assert.deepEqual(response.body.data.id, ids.profiles.linfordChristie);
        });
    });

    it('adds PIL review metadata to response', () => {
      return request(this.api)
        .get('/me')
        .expect(200)
        .expect(response => {
          assert.equal(response.body.data.pil.reviewDate, '2029-01-01T12:00:00.000Z');
          assert.equal(response.body.data.pil.reviewDue, false);
          assert.equal(response.body.data.pil.reviewOverdue, false);
        });
    });

    it('does not include PIL review metadata for users with revoked PILs', () => {
      this.api.setUser({ id: 'hasRevokedPil' });
      return request(this.api)
        .get('/me')
        .expect(200)
        .expect(response => {
          assert.equal(response.body.data.pil.reviewDate, '2021-01-01T12:00:00.000Z');
          assert.equal(response.body.data.pil.reviewDue, undefined);
          assert.equal(response.body.data.pil.reviewOverdue, undefined);
        });
    });

    it('includes a list of allowed actions', () => {
      const actions = {
        global: [],
        [ids.establishments.croydon]: ['establishment.read']
      };
      this.api.setUser({ allowedActions: () => Promise.resolve(actions) });
      return request(this.api)
        .get('/me')
        .expect(200)
        .expect(response => {
          assert.deepEqual(response.body.meta.allowedActions, actions);
        });
    });

    it('includes a list of open invitations for the user', () => {
      return request(this.api)
        .get('/me')
        .expect(200)
        .expect(response => {
          assert.equal(response.body.data.invitations.length, 1);

          // match is case-insensitive but returned email has case preserved
          assert.equal(response.body.data.invitations[0].email, 'TEST1@example.com');

          assert.equal(response.body.data.invitations[0].establishment.name, 'Marvell Pharmaceuticals');
          assert.deepEqual(Object.keys(response.body.data.invitations[0].establishment), ['name']);
        });
    });

    describe('unverified user', () => {

      it('returns only basic data for users without verified email addresses', () => {
        this.api.setUser({ id: 'unverified' });
        return request(this.api)
          .get('/me')
          .expect(200)
          .expect(response => {
            assert.deepEqual(Object.keys(response.body.data), ['id', 'firstName', 'lastName', 'email'], 'only name and email fields should exist on the response data');
          });
      });

    });

  });

  it('posts to workflow on PUT', () => {
    const input = {
      firstName: 'Sterling'
    };

    return request(this.api)
      .put('/me')
      .send({ data: input })
      .expect(200)
      .expect(() => {
        assert.equal(this.workflow.handler.callCount, 1);
        const req = this.workflow.handler.firstCall.args[0];
        const body = req.body;
        assert.equal(req.method, 'POST');
        assert.equal(body.model, 'profile');
        assert.equal(body.action, 'update');
        assert.deepEqual(body.data, input);
      });
  });

  it('throws a 400 error if sent invalid parameters', () => {
    const data = {
      asruUser: true,
      firstName: 'Sterling'
    };

    return request(this.api)
      .put('/me')
      .send({ data })
      .expect(400);
  });

  describe('email preferences', () => {

    it('does not throw a 404 if no preferences are defined', () => {
      return request(this.api)
        .get('/me/email-preferences')
        .expect(200);
    });

  });

  describe('changing email', () => {

    it('rejects if email is in use already', async () => {
      this.api.setUser({ _auth: { sid: 'session' }, verifyPassword: () => Promise.resolve(true) });
      const data = {
        email: 'test2@example.com'
      };

      const proof = await request(this.api).post('/me/email/verify')
        .send({ email: data.email, currentPassword: 'correct' }).expect(200);
      return request(this.api)
        .put('/me/email')
        .send({ data, emailProof: proof.body.data.emailProof })
        .expect(400);
    });

    it('rejects if email is in use already with different casing', async () => {
      this.api.setUser({ _auth: { sid: 'session' }, verifyPassword: () => Promise.resolve(true) });
      const data = {
        email: 'TEST2@example.com'
      };

      const proof = await request(this.api).post('/me/email/verify')
        .send({ email: data.email, currentPassword: 'correct' }).expect(200);
      return request(this.api)
        .put('/me/email')
        .send({ data, emailProof: proof.body.data.emailProof })
        .expect(400);
    });

    describe('password verification', () => {

      it('limits failed password checks per account and returns Retry-After', async () => {
        let attempts = 0;
        this.api.setUser({
          verifyPassword: () => {
            attempts += 1;
            return Promise.resolve(false);
          }
        });

        for (let i = 0; i < 5; i++) {
          await request(this.api)
            .post('/me/verify')
            .send({ username: 'attacker@example.com', password: 'wrong' })
            .expect(403);
        }

        await request(this.api)
          .post('/me/verify')
          .send({ username: 'attacker@example.com', password: 'wrong' })
          .expect(429)
          .expect('Retry-After', /^\d+$/);

        assert.equal(attempts, 5);
      });

      it('verifies the authenticated user email rather than a caller-supplied username', () => {
        let verifiedUsername;
        this.api.setUser({
          verifyPassword: username => {
            verifiedUsername = username;
            return Promise.resolve(true);
          }
        });

        return request(this.api)
          .post('/me/verify')
          .send({ username: 'another-user@example.com', password: 'correct' })
          .expect(200)
          .expect(() => {
            assert.ok(verifiedUsername);
            assert.notEqual(verifiedUsername, 'another-user@example.com');
          });
      });

      it('resets the attempt count after a successful password check', async () => {
        let isValid = false;
        this.api.setUser({
          verifyPassword: () => Promise.resolve(isValid)
        });

        for (let i = 0; i < 4; i++) {
          await request(this.api)
            .post('/me/verify')
            .send({ username: 'user@example.com', password: 'wrong' })
            .expect(403);
        }

        isValid = true;
        await request(this.api)
          .post('/me/verify')
          .send({ username: 'user@example.com', password: 'correct' })
          .expect(200);

        isValid = false;
        await request(this.api)
          .post('/me/verify')
          .send({ username: 'user@example.com', password: 'wrong' })
          .expect(403);
      });

      describe('sensitive account changes', () => {
        it('issues a single-use proof bound to the session and new address', async () => {
          this.api.setUser({ _auth: { sid: 'session-one' }, verifyPassword: () => Promise.resolve(true) });
          const response = await request(this.api).post('/me/email/verify')
            .send({ email: 'new@example.com', currentPassword: 'correct' }).expect(200);
          const emailProof = response.body.data.emailProof;
          assert.match(emailProof, /^[a-f0-9]{64}$/);

          await request(this.api).put('/me/email')
            .send({ data: { email: 'different@example.com' }, emailProof }).expect(403);
          this.api.setUser({ _auth: { sid: 'session-two' }, verifyPassword: () => Promise.resolve(true) });
          await request(this.api).put('/me/email')
            .send({ data: { email: 'new@example.com' }, emailProof }).expect(403);
          this.api.setUser({ _auth: { sid: 'session-one' }, verifyPassword: () => Promise.resolve(true) });
          await request(this.api).put('/me/email')
            .send({ data: { email: 'new@example.com' }, emailProof }).expect(200);
          await request(this.api).put('/me/email')
            .send({ data: { email: 'new@example.com' }, emailProof }).expect(403);
        });

        it('does not issue a proof for a wrong password', async () => {
          this.api.setUser({ _auth: { sid: 'session-one' }, verifyPassword: () => Promise.resolve(false) });
          await request(this.api).post('/me/email/verify')
            .send({ email: 'new@example.com', currentPassword: 'wrong' }).expect(403);
        });

        for (const [path, data] of [
          ['/me/email', { email: 'new@example.com' }],
          ['/me/password', { password: 'NewPassword123' }]
        ]) {
          it(`rejects ${path} without the current password`, async () => {
            await request(this.api).put(path).send({ data }).expect(403);
            assert.equal(this.workflow.handler.callCount, 0);
          });

          it(`rejects ${path} with an incorrect password`, async () => {
            this.api.setUser({ verifyPassword: () => Promise.resolve(false) });
            await request(this.api).put(path).send({ data, currentPassword: 'wrong' }).expect(403);
            assert.equal(this.workflow.handler.callCount, 0);
          });
        }

        it('does not send the current password to the workflow', async () => {
          this.api.setUser({ _auth: { sid: 'session' }, verifyPassword: () => Promise.resolve(true) });
          const proof = await request(this.api).post('/me/email/verify')
            .send({ email: 'new@example.com', currentPassword: 'correct' }).expect(200);
          await request(this.api)
            .put('/me/email')
            .send({ data: { email: 'new@example.com' }, emailProof: proof.body.data.emailProof })
            .expect(200);
          const body = this.workflow.handler.firstCall.args[0].body;
          assert.deepEqual(body.data, { email: 'new@example.com' });
          assert.ok(!JSON.stringify(body).includes('correct'));
        });

        it('shares the verification attempt budget with account changes', async () => {
          this.api.setUser({ verifyPassword: () => Promise.resolve(false) });
          for (let i = 0; i < 5; i++) {
            await request(this.api)
              .post('/me/verify')
              .send({ password: 'wrong' })
              .expect(403);
          }
          await request(this.api)
            .post('/me/email/verify')
            .send({ email: 'new@example.com', currentPassword: 'wrong' })
            .expect(429)
            .expect('Retry-After', /^\d+$/);
        });

        it('requires the password on the establishment profile route too', async () => {
          await request(this.api)
            .put(`/establishment/${ids.establishments.croydon}/profiles/${ids.profiles.linfordChristie}/email`)
            .send({ data: { email: 'new@example.com' } })
            .expect(403);
        });
      });

    });

  });

});
