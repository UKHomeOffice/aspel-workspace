import assert from 'assert';

const waitForCount = browser => {
  browser.waitUntil(async () => {
    const count = await browser.$('.metric.total-tasks p').getText();
    return count !== '-';
  });
};

describe('completed tasks reporting', () => {

  before(async () => {
    await browser.withUser('inspector');
    await browser.$('footer').$('a=Performance metrics').click();
    await browser.$('a=View more data on completed tasks').click();
  });

  it('can access performance metrics page', async () => {
    assert.ok(await browser.$('.metric').$('label=Total tasks completed').isDisplayed());
  });

  it('populates task counts', async () => {
    waitForCount(browser);
    const counts = await browser.$$('table tbody tr td:nth-child(2)');
    for (const count of counts) {
      assert.notEqual(await count.getText(), '-');
    }
  });

  it('establishment and ASRU initiated task counts are populated', async () => {
    await browser.$('a=Establishment initiated tasks').click();
    waitForCount(browser);
    assert.ok(await (await (await browser.$('.metric.total-tasks p')).getText()).match(/[0-9]+/));

    await browser.$('a=ASRU initiated tasks').click();
    waitForCount(browser);
    assert.ok(await (await (await browser.$('.metric.total-tasks p')).getText()).match(/[0-9]+/));
  });

});
