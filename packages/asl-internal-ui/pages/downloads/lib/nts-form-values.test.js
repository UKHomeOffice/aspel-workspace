const assert = require('assert');
// eslint-disable-next-line implicit-dependencies/no-implicit
const test = require('node:test');
const getNtsFormValues = require('./nts-form-values');

test('returns an empty object when no NTS fields are supplied', () => {
  assert.deepStrictEqual(getNtsFormValues({}), {});
});

test('picks date components and ra', () => {
  const values = {
    'date-from-day': '01',
    'date-from-month': '05',
    'date-from-year': '2024',
    'date-to-day': '31',
    'date-to-month': '05',
    'date-to-year': '2024',
    ra: 'true'
  };

  assert.deepStrictEqual(getNtsFormValues({ ...values, tab: 'nts' }), values);
});

test('omits non-string and unrelated values', () => {
  const values = getNtsFormValues({
    'date-from-day': '',
    'date-from-month': ['1', '2'],
    'date-to-month': null,
    ra: { x: '1' },
    ignored: 'value'
  });

  assert.deepStrictEqual(values, { 'date-from-day': '' });
});
