import assert from 'assert';

describe('reporting', () => {

  before(async () => {
    await browser.withUser('inspector');
    await browser.$('footer').$('a=Performance metrics').click();
  });

  it('can access performance metrics page', async () => {
    assert.equal(await browser.$('h1').getText(), 'Data and performance');
  });

  it('populates task counts', async () => {
    assert.ok(await (await (await browser.$('.metric.tasks-completed p')).getText()).match(/^[0-9]+$/));
    assert.ok(await (await (await browser.$('.metric.ppls-granted p')).getText()).match(/^[0-9]+$/));
    assert.ok(await (await (await browser.$('.metric.ppl-iterations p')).getText()).match(/^[0-9]+$/));
  });

});
