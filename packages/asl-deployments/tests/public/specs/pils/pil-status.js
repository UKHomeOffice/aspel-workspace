import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';

describe('PIL application smoke tests', () => {
  it('shows an apply/continue button on Profile page if PIL application not started, or in progress', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Bruce Banner');
    assert(await browser.$('a[href*="pil/create"]').isDisplayed());
  });

  it('doesn\'t show an apply/continue button on Profile page if PIL is active', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Dagny Aberkirder');
    assert(!await browser.$('a[href*="pil/create"]').isDisplayed());
  });
});
