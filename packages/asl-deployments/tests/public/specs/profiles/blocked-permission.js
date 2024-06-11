import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';

describe('Blocked permission', () => {
  it('prevents users from viewing the blocked establishment details', async() => {
    await browser.withUser('blocked');
    await browser.$('h3=University of Croydon').click();
    await browser.$('.expanding-panel.open').waitForDisplayed();

    assert(!await browser.$('a*=Go to University of Croydon').isDisplayed(), 'there should be no establishment details link');
    assert(!await browser.$('button=Apply for project licence').isDisplayed(), 'there should be no apply for project button');
    assert(!await browser.$('h3=Personal licence').isDisplayed(), 'there should be no personal licence section');
    assert(await browser.$('p*=Your access to this establishment has been blocked.').isDisplayed(), 'there should be a message informing of blocked status');
  });

  it('does not prevent users from seeing non-blocked establishment details', async() => {
    await browser.withUser('blocked');
    await browser.$('h3=Marvell Pharmaceutical').click();
    await browser.$('.expanding-panel.open').waitForDisplayed();

    assert(await browser.$('a=Go to Marvell Pharmaceutical').isDisplayed(), 'there should be an establishment details link');
    assert(await browser.$('button=Apply for project licence').isDisplayed(), 'there should be an apply for project button');
    assert(await browser.$('h3=Personal licence').isDisplayed(), 'there should be a personal licence section');
    assert(!await browser.$('p*=Your access to this establishment has been blocked.').isDisplayed(), 'there should not be a message informing of blocked status');
  });

  it('blocked users can still see a PIL held at blocked establishment if they are viewing via a non-blocked establishment', async() => {
    await browser.withUser('blocked');
    await browser.$('h3=Marvell Pharmaceutical').click();
    await browser.$('.expanding-panel.open').waitForDisplayed();
    await browser.$('.expanding-panel.open').$('a[href*="/pil/"]').click();

    assert(await browser.$('h1=Personal licence').isDisplayed(), 'the personal licence should be visible');
  });

  it('prevents the user deep linking to pages under the blocked establishment', async() => {
    await browser.withUser('blocked');

    await browser.url('/establishments/8201/people/9f463d0e-c18d-4251-8b8c-436f899812e1');
    assert(await browser.$('h1=Page not found').isDisplayed(), 'user gets a 404 page');

    await browser.url('/establishments/8201/people/9f463d0e-c18d-4251-8b8c-436f899812e1/pil/04c88dd7-e711-4ec7-afc8-fe721dbe9588');
    assert(await browser.$('h1=Page not found').isDisplayed(), 'user should get a 404 page');
  });

  it('admins can unblock the user', async() => {
    await browser.withUser('holc');
    await gotoProfile(await browser, 'Blocked User', 'University of Croydon');
    await browser.$('a=Change / remove').click();
    await browser.$('label[for*="role-basic"]').click();
    await browser.$('button=Save').click();

    assert.ok(await browser.$('p=Personal (Basic access)').isDisplayed());

    // check access is restored to UoC
    await browser.withUser('blocked');
    await browser.$('h3=University of Croydon').click();
    await browser.$('.expanding-panel.open').waitForDisplayed();
    assert.ok(await browser.$('.expanding-panel.open').$('a=Go to University of Croydon').isDisplayed(), 'there should be an establishment details link');
    await browser.$('.expanding-panel.open').$('a=Go to University of Croydon').click();
    assert.ok(await browser.$('.document-header').$('h2=University of Croydon').isDisplayed());

    // set user back to blocked
    await browser.withUser('holc');
    await gotoProfile(await browser, 'Blocked User', 'University of Croydon');
    await browser.$('a=Change / remove').click();

    await browser.$('h1=Update permissions').waitForExist();
    await browser.$('label[for*="role-basic"]').click();
    await browser.$('button=Save').click();
  });

});
