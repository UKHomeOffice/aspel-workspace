import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

describe('Project Training Record ', () => {

  before(async () => {
    await browser.withUser('basic');
  });

  it('training record should show on PPL applications awaiting endorsement', async () => {
    await gotoProjectLandingPage(browser, 'Training record test application', 'Drafts');
    await browser.$('a=Open application').click();

    await browser.$('a=Training').click();
    await assert.ok(browser.$('p*=Certificate number: 12345').isDisplayed());

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Submit PPL application').click();
    await browser.$('a*=track the progress of this request').click();
    await browser.$('a=View latest submission').click();

    await browser.$('a=Training').click();
    assert.ok(await browser.$('p*=Certificate number: 12345').isDisplayed());
  });

});
