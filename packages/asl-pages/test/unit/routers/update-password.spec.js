const express = require('express');
const request = require('supertest');
const timers = require('timers');

jest.mock('@asl/service/ui', () => ({
  page: () => require('express').Router()
}));

const updatePassword = require('../../../pages/user/update-password');

describe('password change', () => {
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
    session = { form: {} };
    api = jest.fn().mockResolvedValue({});
    app = express();
    app.use((req, res, next) => {
      req.session = session;
      req.user = { profile: { id: 'profile' } };
      req.api = api;
      req.buildRoute = (name, options) => options && options.suffix ? '/success' : '/password';
      res.locals.static = {};
      next();
    });
    app.use('/password', updatePassword({}));
    app.use((err, req, res, next) => res.status(err.status || 500).send(err.message));
  });

  const submit = app => request(app).post('/password').type('form').send({
    oldPassword: 'OldPassword123',
    password: 'NewPassword123',
    passwordConfirm: 'NewPassword123'
  });

  it('sends both passwords to the API and redirects to success', async () => {
    await submit(app).expect(302).expect('Location', '/success');
    expect(api).toHaveBeenCalledWith('/me/password', {
      method: 'PUT',
      json: { currentPassword: 'OldPassword123', data: { password: 'NewPassword123' } }
    });
    expect(session.form['profile-password']).toBeUndefined();
  });

  it('returns to the form without saving passwords when verification fails', async () => {
    api.mockRejectedValue({ status: 403 });
    await submit(app).expect(302).expect('Location', '/password');
    expect(session.form['profile-password'].validationErrors.oldPassword).toBe('invalid');
    expect(session.form['profile-password'].values).toEqual({});
  });
});
