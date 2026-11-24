const express = require('express');
const request = require('supertest');
const timers = require('timers');
const confirm = require('../../../pages/user/update-email/routers/confirm');

describe('email change confirmation', () => {
  let app;
  let session;
  let api;
  let originalSetImmediate;

  beforeAll(() => {
    originalSetImmediate = global.setImmediate;
    global.setImmediate = timers.setImmediate;
  });

  afterAll(() => {
    global.setImmediate = originalSetImmediate;
  });

  beforeEach(() => {
    session = {
      form: { 'profile-email': { values: { email: 'new@example.com', password: 'old-secret' }, emailProof: 'proof' } },
      save: callback => callback()
    };
    api = jest.fn().mockResolvedValue({});
    app = express();
    app.use((req, res, next) => {
      req.session = session;
      req.model = { id: 'profile-email' };
      req.api = api;
      req.buildRoute = (name, options) => options && options.suffix ? '/confirm' : '/account';
      req.notification = jest.fn();
      res.locals.static = {};
      next();
    });
    app.use('/confirm', confirm());
    app.use((req, res) => res.json(res.locals.static));
  });

  it('requires a valid CSRF token before calling the API', async () => {
    await request(app).get('/confirm').expect(200);
    await request(app)
      .post('/confirm')
      .type('form')
      .send({ _csrf: 'invalid' })
      .expect(403);
    expect(api).not.toHaveBeenCalled();
  });

  it('passes the proof to the API without exposing the saved password', async () => {
    const response = await request(app).get('/confirm').expect(200);
    expect(response.body.values).toEqual({ email: 'new@example.com' });
    expect(session.form['profile-email'].values.password).toBeUndefined();

    await request(app)
      .post('/confirm')
      .type('form')
      .send({ _csrf: response.body.csrfToken })
      .expect(302);

    expect(api).toHaveBeenCalledWith('/me/email', {
      method: 'PUT',
      json: { emailProof: 'proof', data: { email: 'new@example.com' } }
    });
    expect(session.form['profile-email']).toBeUndefined();
  });

  it('returns to the form when the proof is rejected', async () => {
    api.mockRejectedValue({ status: 403 });
    const response = await request(app).get('/confirm').expect(200);

    await request(app)
      .post('/confirm')
      .type('form')
      .send({ _csrf: response.body.csrfToken })
      .expect(302)
      .expect('Location', '/account');

    expect(session.form['profile-email'].validationErrors.password).toBe('expired');
    expect(session.form['profile-email'].emailProof).toBeUndefined();
    expect(session.form['profile-email'].values).toEqual({ email: 'new@example.com' });
  });

  it('does not allow confirmation without a proof', async () => {
    delete session.form['profile-email'].emailProof;
    await request(app).post('/confirm').type('form').send({ _csrf: 'anything' })
      .expect(302).expect('Location', '/account');
    expect(api).not.toHaveBeenCalled();
  });
});
