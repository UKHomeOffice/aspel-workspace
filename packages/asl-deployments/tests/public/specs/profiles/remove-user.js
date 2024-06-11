import assert from 'assert';

import { gotoProfile } from '../../helpers/profile.js';

describe('Remove permission', () => {

  it('will remove a non named person from establishment', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Ella Bella', 'University of Croydon');
    await browser.$('a=Change / remove').click();

    assert.ok(await browser.$('h2=Remove permissions').isDisplayed());

    await browser.$('.govuk-button=Remove').click();
    assert.ok(await browser.$('h1=Confirm removal of Ella Bella from this establishment'));
    await browser.$('button=I understand, remove now').click();
    await browser.waitForSuccess();

    await browser.$('.search-box input[type="text"]').setValue('Ella Bella');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert(!await browser.$('a=Ella Bella').isDisplayed());
  });

  it('will allow removal of a person with a PIL held at another establishment', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Parnell Stump', 'Marvell Pharmaceutical');
    await browser.$('a=Change / remove').click();

    await browser.$('h1=Update permissions').waitForExist();
    assert.ok(await browser.$('h2=Remove permissions').isDisplayed());

    await browser.$('.govuk-button=Remove').click();
    await browser.$('button=I understand, remove now').click();
    await browser.waitForSuccess();

    await browser.$('.search-box input[type="text"]').setValue('Parnell Stump');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert(!await browser.$('a=Parnell Stump').isDisplayed());
  });

  it('will not allow removal of a person with a PIL held at the same establishment', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Parnell Stump', 'University of Croydon');
    await browser.$('a=Change / remove').click();

    assert.ok(await browser.$('h2=Remove permissions').isDisplayed());

    assert.ok(await browser.$('li=they hold a personal licence here - licences must be revoked or transferred first').isDisplayed());
    assert.equal(await browser.$('.govuk-button=Remove').getAttribute('disabled'), 'true');
  });

  it('will display disabled remove button for a named person', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Megan Alberts', 'University of Croydon');
    await browser.$('a=Change / remove').click();

    assert.ok(await browser.$('h2=Remove permissions').isDisplayed());

    assert.ok(await browser.$('li=they hold one or more named roles here - roles must be reassigned first').isDisplayed());
    assert.equal(await browser.$('.govuk-button=Remove').getAttribute('disabled'), 'true');
  });

  it('will display disabled remove button for a person with PPLs', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Basic User', 'University of Croydon');
    await browser.$('a=Change / remove').click();

    assert.ok(await browser.$('h2=Remove permissions').isDisplayed());

    assert.ok(await browser.$('li=they hold one or more project licences here - licences must be revoked or transferred first').isDisplayed());
    assert.equal(await browser.$('.govuk-button=Remove').getAttribute('disabled'), 'true');
  });

  it('will display disabled remove button for a person with AA', async() => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'AA User', 'Small Pharma');
    await browser.$('a=Change / remove').click();

    assert.ok(await browser.$('h2=Remove permissions').isDisplayed());

    assert.ok(await browser.$('li=they hold one or more projects with additional availability here - additional availability must be removed first').isDisplayed());
    assert.equal(await browser.$('.govuk-button=Remove').getAttribute('disabled'), 'true');
  });

  it('cannot leave establishment if has named roles/licences', async() => {
    await browser.withUser('basic');
    await gotoProfile(browser, 'Basic User', 'University of Croydon');
    assert.ok(!await browser.$('.govuk-button=Leave establishment').isDisplayed());
  });

  it('can leave establishment if where no licences/roles held', async() => {
    await browser.withUser('basic');
    await gotoProfile(browser, 'Basic User', 'University of Life');
    const leaveButton = await browser.$('.govuk-button=Leave establishment');
    assert.ok(await leaveButton.isDisplayed());

    await leaveButton.click();
    await browser.$('button=I understand, leave now').click();

    await browser.waitForSuccess();

    assert.ok(await browser.$('p=You\'ve left University of Life.'));
    assert.ok(!await browser.$('h3=University of Life').isDisplayed());
    assert.ok(await browser.$('h3=University of Croydon').isDisplayed());
  });
});
