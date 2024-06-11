import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';

describe('Change permission', () => {
  it('will not display change/remove link for non admin user', async() => {
    await browser.withUser('read');
    await gotoProfile(browser, 'Dagny Aberkirder', 'University of Croydon');
    assert(!await browser.$('a=Change / remove').isDisplayed());
  });

  it('will display change/remove link for admin user', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Dagny Aberkirder', 'University of Croydon');

    assert(await browser.$('a=Change / remove').isDisplayed());
  });

  it('will allow admin to change permission level of profile', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Dagny Aberkirder', 'University of Croydon');
    await browser.$('a=Change / remove').click();
    await browser.$('label[for*="role-read"]').click();
    await browser.$('button=Save').click();
    await browser.waitForSuccess();
    assert.ok(await browser.$('p=Overview (Intermediate access)').isDisplayed());
  });

  it('will allow removing permissions of a user who holds a PPL at another establishment', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Basic Small-Pharma', 'University of Croydon');
    await browser.$('a=Change / remove').click();

    assert.ok(!await browser.$('.govuk-button=Remove').getAttribute('disabled'), 'Remove button should not be disabled');
  });

  it('will not allow removing permissions of a user who holds a PPL at the same establishment', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Basic Small-Pharma', 'Small Pharma');
    await browser.$('a=Change / remove').click();

    assert.ok(await browser.$('button=Remove').getAttribute('disabled'), 'Remove button should not be disabled');
  });

});
