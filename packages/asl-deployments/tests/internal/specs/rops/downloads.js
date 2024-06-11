import assert from 'assert';

describe('ROPS downloads', () => {

  before(async () => {
    await browser.withUser('asruropper');
  });

  it('can access downloads tab', async () => {
    await browser.$('.footer-menu').$('a=Returns of procedures').click();

    await browser.$('.govuk-tabs').$('a=Download returns').click();

    assert.ok(await browser.$('button=Download returns').isDisplayed());
  });

  it('can request a download', async () => {
    await browser.$('.footer-menu').$('a=Returns of procedures').click();

    await browser.$('.govuk-tabs').$('a=Download returns').click();

    assert.ok(await (await browser.$('td=No returns downloaded yet')).isDisplayed());

    await browser.$('button=Download returns').click();

    await browser.waitForSuccess();

    assert.equal(await browser.$$('.govuk-table tbody tr').length, 1);
    assert.ok(await browser.$('td=Pending').isDisplayed());
  });

});
