const assert = require('assert');
// eslint-disable-next-line implicit-dependencies/no-implicit
const { test } = require('node:test');
const express = require('express');
// eslint-disable-next-line implicit-dependencies/no-implicit
const request = require('supertest');
// eslint-disable-next-line implicit-dependencies/no-implicit
const proxyquire = require('proxyquire').noCallThru();
const moment = require('moment');
const content = require('./content');

const form = proxyquire('@asl/pages/pages/common/routers/form', {
  '../../../lib/middleware/csrf': {
    generateSecret: (req, res, next) => next(),
    checkSecret: (req, res, next) => next()
  }
});

const values = {
  'date-from-day': '1',
  'date-from-month': '1',
  'date-from-year': '2024',
  'date-to-day': '1',
  'date-to-month': '7',
  'date-to-year': '2024',
  ra: 'false'
};

function setup({ noResults = false, featureFlag = true, csrf = false } = {}) {
  const session = { save: callback => callback() };
  const downloads = [];
  const page = proxyquire('./index', {
    '@asl/service/ui': { page: () => express.Router() },
    '@asl/service/ui/feature-flag': { FEATURE_FLAG_NTS_DOCX: 'nts-docx' },
    './routes': {},
    '@asl/pages/pages/common/routers/form': csrf ? require('@asl/pages/pages/common/routers/form') : form,
    './routers/nts-docx': () => (req, res, next) => {
      downloads.push(req.form.values);
      if (noResults) {
        return next({ validation: { form: 'noResults' } });
      }
      res.attachment('nts.docx').send('document');
    }
  });
  const app = express();
  app.use((req, res, next) => {
    req.session = session;
    req.hasFeatureFlag = () => featureFlag;
    req.api = () => Promise.resolve({ json: { data: [] } });
    res.locals.static = {};
    res.sendResponse = () => res.json(res.locals);
    next();
  });
  app.use('/downloads', page({}));
  app.use((err, req, res, next) => res.status(500).json({ message: err.message }));
  return { app, session, downloads };
}

test('downloads schema-processed values and ignores unrelated inputs', async () => {
  const { app, downloads } = setup();
  await request(app).post('/downloads?tab=nts').type('form').send({ ...values, unrelated: 'ignore' }).expect(200);
  assert.deepStrictEqual(downloads, [{
    'date-from': '2024-1-1',
    'date-to': '2024-7-1',
    ra: false
  }]);
});

test('accepts both RA options', async () => {
  const { app, downloads } = setup();
  await request(app).post('/downloads?tab=nts').type('form').send({ ...values, ra: 'true' }).expect(200);
  assert.strictEqual(downloads[0].ra, true);
});

test('uses standard session errors and restores form values after invalid submissions', async () => {
  const { app, downloads } = setup();
  await request(app).post('/downloads?tab=nts').type('form')
    .send({ ...values, 'date-from-day': '', ra: 'invalid' })
    .expect(302).expect('Location', '/downloads?tab=nts');
  const response = await request(app).get('/downloads?tab=nts').expect(200);
  assert.deepStrictEqual(response.body.static.errors, { 'date-from': 'validDate', ra: 'required' });
  assert.deepStrictEqual(response.body.model.dateRange, { 'date-from': '2024-1-', 'date-to': '2024-7-1' });
  assert.strictEqual(response.body.model.ra, 'invalid');
  assert.strictEqual(downloads.length, 0);
});

test('enforces required dates and RA', async () => {
  const { app, session, downloads } = setup();
  await request(app).post('/downloads?tab=nts').type('form').send({}).expect(302);
  assert.deepStrictEqual(session.form['nts-download'].validationErrors, {
    'date-from': 'required',
    'date-to': 'required',
    ra: 'required'
  });
  assert.strictEqual(downloads.length, 0);
});

test('enforces date boundaries, real dates, date order and the six-month limit', async t => {
  const cases = [
    [{ 'date-from-year': '2019', 'date-from-month': '7', 'date-from-day': '30' }, 'date-from', 'dateIsSameOrAfter'],
    [{ 'date-to-year': '2019', 'date-to-month': '7', 'date-to-day': '30' }, 'date-to', 'dateIsSameOrAfter'],
    [{ 'date-from-month': '2', 'date-from-day': '31' }, 'date-from', 'validDate'],
    [{ 'date-to-month': '2', 'date-to-day': '31' }, 'date-to', 'validDate'],
    [{ 'date-from-month': '8' }, 'date-to', 'dateIsAfter'],
    [{ 'date-to-day': '2' }, 'dateRange', 'customValidate'],
    [{
      'date-to-year': moment().add(1, 'day').format('YYYY'),
      'date-to-month': moment().add(1, 'day').format('M'),
      'date-to-day': moment().add(1, 'day').format('D')
    }, 'date-to', 'dateIsSameOrBefore']
  ];
  for (const [changes, field, error] of cases) {
    await t.test(`${field}: ${error}`, async () => {
      const { app, session, downloads } = setup();
      await request(app).post('/downloads?tab=nts').type('form').send({ ...values, ...changes }).expect(302);
      assert.strictEqual(session.form['nts-download'].validationErrors[field], error);
      assert.strictEqual(downloads.length, 0);
    });
  }
});

test('allows the same start and end date', async () => {
  const { app } = setup();
  await request(app).post('/downloads?tab=nts').type('form').send({ ...values, 'date-to-month': '1' }).expect(200);
});

test('preserves the existing date-order message and supplies the start date', async () => {
  assert.strictEqual(
    content.errors['date-to'].date.after,
    'End date must be the same as or before {{date}}, the start date'
  );
  const { app } = setup();
  await request(app).post('/downloads?tab=nts').type('form')
    .send({ ...values, 'date-from-month': '8', 'date-to-month': '7' })
    .expect(302).expect('Location', '/downloads?tab=nts');
  const response = await request(app).get('/downloads?tab=nts').expect(200);
  assert.ok(response.body.static.schema['date-to'].validate.some(rule =>
    rule.dateIsAfter === '2024-08-01'
  ));
});

test('uses standard form errors for empty results and retains the selected criteria', async () => {
  assert.strictEqual(content.errors.noResults.noResults, 'There are no projects for this date range');
  const { app } = setup({ noResults: true });
  await request(app).post('/downloads?tab=nts').type('form').send(values)
    .expect(302).expect('Location', '/downloads?tab=nts');
  const response = await request(app).get('/downloads?tab=nts').expect(200);
  assert.deepStrictEqual(response.body.static.errors, { noResults: 'noResults' });
  assert.strictEqual(response.body.model.ra, false);
  assert.strictEqual(response.body.model.dateRange['date-from'], '2024-1-1');
});

test('rejects submissions when the NTS feature is disabled', async () => {
  const { app, downloads } = setup({ featureFlag: false });
  await request(app).post('/downloads?tab=nts').type('form').send(values).expect(500);
  assert.strictEqual(downloads.length, 0);
});

test('requires the CSRF token generated by the form middleware', async () => {
  const { app, downloads } = setup({ csrf: true });
  const response = await request(app).get('/downloads?tab=nts').expect(200);
  assert.ok(response.body.static.csrfToken);
  await request(app).post('/downloads?tab=nts').type('form').send(values).expect(302);
  assert.strictEqual(downloads.length, 0);
  await request(app).post('/downloads?tab=nts').type('form')
    .send({ ...values, _csrf: response.body.static.csrfToken }).expect(200);
  assert.strictEqual(downloads.length, 1);
});
