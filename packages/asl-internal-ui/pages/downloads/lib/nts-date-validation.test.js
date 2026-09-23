const assert = require('assert');
// eslint-disable-next-line implicit-dependencies/no-implicit
const test = require('node:test');
const moment = require('moment');
const { validateNtsDateRangeQuery } = require('./nts-date-validation');

test('validates a complete date range query', () => {
  const query = {
    'date-from': '2024-05-01',
    'date-to': '2024-05-31',
    ra: 'true'
  };

  assert.deepStrictEqual(validateNtsDateRangeQuery(query), {
    isValid: true,
    errors: {},
    model: {
      'date-from': '2024-05-01',
      'date-to': '2024-05-31'
    }
  });
});

test('builds the model from date component query values', () => {
  const result = validateNtsDateRangeQuery({
    'date-from-day': '01',
    'date-from-month': '05',
    'date-from-year': '2024',
    'date-to-day': '31',
    'date-to-month': '05',
    'date-to-year': '2024',
    ra: 'false'
  });

  assert.deepStrictEqual(result.model, {
    'date-from': '2024-05-01',
    'date-to': '2024-05-31'
  });
  assert.strictEqual(result.isValid, true);
  assert.deepStrictEqual(result.errors, {});
});

test('reports missing and invalid query values', () => {
  const result = validateNtsDateRangeQuery({
    'date-from': '',
    'date-to': '2024-02-31',
    ra: 'yes'
  });

  assert.deepStrictEqual(result.errors, {
    'date-from': 'required',
    'date-to': 'validDate',
    ra: 'invalid'
  });
  assert.strictEqual(result.isValid, false);
});

test('requires ra', () => {
  const result = validateNtsDateRangeQuery({
    'date-from': '2024-05-01',
    'date-to': '2024-05-31'
  });

  assert.deepStrictEqual(result.errors, { ra: 'required' });
  assert.strictEqual(result.isValid, false);
});

test('rejects dates outside the date boundaries', () => {
  const result = validateNtsDateRangeQuery({
    'date-from': moment().add(1, 'day').format('YYYY-MM-DD'),
    'date-to': '2019-07-30',
    ra: 'true'
  });

  assert.deepStrictEqual(result.errors, {});
  assert.strictEqual(result.isValid, false);
});

test('rejects a date range where the start is after the end', () => {
  const result = validateNtsDateRangeQuery({
    'date-from': '2024-05-31',
    'date-to': '2024-05-01',
    ra: 'false'
  });

  assert.deepStrictEqual(result.errors, {});
  assert.strictEqual(result.isValid, false);
});
