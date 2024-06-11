import { gotoProjectLandingPage } from '../../helpers/project.js';
import assert from 'assert';

describe('Unsubmit ROP', () => {

  before(async () => {
    await browser.withUser('inspector');
  });

  it('can unsubmit a rop', async () => {
    await gotoProjectLandingPage(browser, 'ROP Unsubmit Test');
    await browser.$('a=Reporting').click();
    await browser.$('a*=View submitted return').click();

    assert.ok(await browser.$('button=Correct return').isDisplayed());

    await browser.$('button=Correct return').click();
    await browser.$('a=Add procedures').waitForDisplayed();

    assert.ok(await browser.$('a=Add procedures').isDisplayed());
  });

});
