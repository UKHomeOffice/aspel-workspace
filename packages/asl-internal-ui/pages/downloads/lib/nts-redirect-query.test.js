const assert = require('assert');
// eslint-disable-next-line implicit-dependencies/no-implicit
const test = require('node:test');
const getNtsRedirectQuery = require('./nts-redirect-query');

test('includes the NTS tab and validation flag by default', () => {
  assert.strictEqual(
    getNtsRedirectQuery({}),
    'tab=nts&validateNtsDates=true'
  );
});

test('includes supplied date components and ra', () => {
  const query = getNtsRedirectQuery({
    'date-from-day': '01',
    'date-from-month': '05',
    'date-from-year': '2024',
    'date-to-day': '31',
    'date-to-month': '05',
    'date-to-year': '2024',
    ra: 'true'
  });

  assert.strictEqual(
    query,
    'tab=nts&validateNtsDates=true&date-from-day=01&date-from-month=05&date-from-year=2024&date-to-day=31&date-to-month=05&date-to-year=2024&ra=true'
  );
});

test('omits empty and unrelated query values', () => {
  const query = getNtsRedirectQuery({
    'date-from-day': '',
    'date-to-month': null,
    ignored: 'value'
  });

  assert.strictEqual(query, 'tab=nts&validateNtsDates=true');
});

test('preserves an explicitly supplied empty ra value', () => {
  assert.strictEqual(
    getNtsRedirectQuery({ ra: '' }),
    'tab=nts&validateNtsDates=true&ra='
  );
});

test('URL-encodes query values', () => {
  assert.strictEqual(
    getNtsRedirectQuery({ 'date-from-day': '1 2' }),
    'tab=nts&validateNtsDates=true&date-from-day=1+2'
  );
});
