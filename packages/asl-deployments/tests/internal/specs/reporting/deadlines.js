import assert from 'assert';

describe('deadlines reporting', () => {

  before(async () => {
    await browser.withUser('inspector');
    await browser.$('footer').$('a=Performance metrics').click();
    await browser.$('a=View more data on tasks with missed deadlines').click();
  });

  it('can access deadlines page', async () => {
    await assert.ok(browser.$('label=Missed statutory deadline').isDisplayed());
    await assert.ok(browser.$('label=Missed internal target').isDisplayed());
  });

});
