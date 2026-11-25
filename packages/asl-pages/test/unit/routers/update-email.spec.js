const express = require('express');
const request = require('supertest');
const timers = require('timers');

jest.mock('@asl/service/ui', () => ({
  page: () => require('express').Router()
}));

const updateEmail = require('../../../pages/user/update-email');

describe('email change form', () => {
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
    session = { form: { 'profile-email': { values: {}, emailProof: 'old-proof' } } };
    api = jest.fn().mockResolvedValue({ json: { data: { emailProof: 'new-proof' } } });
    app = express();
    app.use((req, res, next) => {
      req.session = session;
      req.user = { profile: { id: 'profile', email: 'old@example.com' } };
      req.api = api;
      req.buildRoute = (name, options) => options && options.suffix ? '/confirm' : '/email';
      res.locals.static = {};
      next();
    });
    app.use('/email', updateEmail({}));
    app.use((err, req, res, next) => res.status(err.status || 500).send(err.message));
  });

  const submit = app => request(app).post('/email').type('form').send({
    email: 'new@example.com',
    emailConfirm: 'new@example.com',
    password: 'secret'
  });

  it('verifies on the first screen and saves only the proof', async () => {
    await submit(app).expect(302).expect('Location', '/confirm');
    expect(api).toHaveBeenCalledWith('/me/email/verify', {
      method: 'POST', json: { email: 'new@example.com', currentPassword: 'secret' }
    });
    expect(session.form['profile-email'].emailProof).toBe('new-proof');
    expect(JSON.stringify(session)).not.toContain('secret');
  });

  it('clears an old proof when the password is rejected', async () => {
    api.mockRejectedValue({ status: 403 });
    await submit(app).expect(302).expect('Location', '/email');
    expect(session.form['profile-email'].emailProof).toBeUndefined();
    expect(session.form['profile-email'].validationErrors.password).toBe('invalid');
    expect(JSON.stringify(session)).not.toContain('secret');
  });

  it('clears an old proof even when form validation fails', async () => {
    await request(app).post('/email').type('form').send({
      email: 'new@example.com', emailConfirm: 'different@example.com', password: 'secret'
    }).expect(302);
    expect(session.form['profile-email'].emailProof).toBeUndefined();
    expect(api).not.toHaveBeenCalled();
  });
});
