const assert = require('assert');
const knex = require('knex');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { test } = require('../../knexfile');
const { seed } = require('../../seeds');
const establishments = require('../../seeds/data/establishments.json');

describe('Database seed', function() {
  this.timeout(30000);

  let db;
  let transaction;

  before(async () => {
    db = knex(test);
    transaction = await db.transaction();
  });

  after(async () => {
    if (transaction) {
      await transaction.rollback();
    }
    if (db) {
      await db.destroy();
    }
  });

  it('clears existing data and can be run repeatedly', async () => {
    await seed(transaction);

    const fixture = establishments[0];
    await transaction('establishments').where({ id: fixture.id }).update({ name: 'Changed name' });

    const before = dayJs();
    await seed(transaction);
    const after = dayJs();

    const rows = await transaction('establishments').select('id', 'name');
    assert.strictEqual(rows.length, establishments.length);
    assert.strictEqual(rows.find(row => row.id === fixture.id).name, fixture.name);

    const reviews = await transaction('pils')
      .join('profiles', 'profiles.id', 'pils.profileId')
      .whereIn('profiles.email', ['overdue-pil-review@example.com', 'due-pil-review@example.com'])
      .select('profiles.email', 'pils.reviewDate');
    assert.strictEqual(reviews.length, 2);

    for (const { email, reviewDate } of reviews) {
      const expected = email === 'overdue-pil-review@example.com'
        ? { method: 'subtract', num: 1, unit: 'day' }
        : { method: 'add', num: 2, unit: 'months' };
      const date = dayJs(reviewDate);
      assert(date.valueOf() >= before[expected.method](expected.num, expected.unit).valueOf());
      assert(date.valueOf() <= after[expected.method](expected.num, expected.unit).valueOf());
    }
  });
});
