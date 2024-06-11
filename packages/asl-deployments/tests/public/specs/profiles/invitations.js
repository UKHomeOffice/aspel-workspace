import assert from 'assert';
import _ from 'lodash';
import { getRecentEmailsFor } from '../../../helpers/common.js';
import { gotoEstablishment } from '../../helpers/establishment.js';

const invite = async(browser, email) => {
  await gotoEstablishment(browser, 'University of Croydon');
  await browser.$('a=People').click();
  await browser.$('*=Invite').click();

  await browser.$('input[name=firstName]').setValue('Test');
  await browser.$('input[name=lastName]').setValue('User');

  await browser.$('input[name=email]').setValue(email);
  await browser.$('label[for*="role-admin"]').click();

  await browser.$('button*=Send invitation').click();

  await browser.waitForSuccess();

  const alert = await browser.$('.alert').getText();
  return alert;
};

describe('Invitations', () => {

  beforeEach(async() => {
    await browser.withUser('holc');
  });

  describe('Invite user', () => {

    it('will reject invalid emails', async() => {
      await gotoEstablishment(browser, 'University of Croydon');
      await browser.$('a=People').click();
      await browser.$('*=Invite').click();

      await browser.$('input[name=firstName]').setValue('Test');
      await browser.$('input[name=lastName]').setValue('User');

      await browser.$('input[name=email]').setValue('invalid email');
      await browser.$('label[for*="role-admin"]').click();

      await browser.$('button*=Send invitation').click();

      assert.ok(await browser.$('.govuk-form-group--error label[for="email"]').isDisplayed(), 'validation error should be shown on the email field');
    });

    it('will display a notification message after successful form submit', async() => {
      const notification = await invite(browser, 'test@example.com');
      assert.equal(notification, 'Invitation sent to test@example.com.');
    });

    it('newly logged in users are shown an empty dashboard', async() => {
      await browser.withUser('newuser');
      const title = await browser.$('h1').getText();
      assert.equal(title, 'Hello Eve', 'Greeting for user "Eve Adams" is shown in header');
    });

    it('can accept an invitation', async() => {
      const EMAIL = 'eveadams@example.com';
      const inviteTime = new Date();
      await invite(browser, EMAIL);
      const emails = await getRecentEmailsFor(browser, EMAIL, 'invitation', inviteTime);
      const acceptLink = _.get(emails, '[0].body.acceptLink');
      // Eve adams
      await browser.withUser('newuser');
      await browser.url(acceptLink);

      assert.equal(await browser.$('h1').getText(), 'Accept invitation');
      assert.equal(await browser.$('h2').getText(), 'University of Croydon');

      await browser.$('button=Accept').click();
      assert.ok(await browser.$('header=University of Croydon').isDisplayed());

      await browser.withUser('holc');
      await gotoEstablishment(browser, 'University of Croydon');
      await browser.$('a=People').click();

      await browser.$('input[name="filter"]').setValue('Eve Adams');
      await browser.$('button[type="submit"]').click();

      await browser.$('a=Eve Adams').click();
      await browser.$('a=Change / remove').click();
      await browser.$('.govuk-button=Remove').click();
      await browser.$('.govuk-button=I understand, remove now').click();
      await browser.waitForSuccess();

      await browser.withUser('newuser');
      assert.ok(!await browser.$('header=University of Croydon').isDisplayed());
    });

    it('doesn\'t throw a validation error if the email address contains an apostrophe', async() => {
      await gotoEstablishment(browser, 'University of Croydon');
      await browser.$('a=People').click();
      await browser.$('*=Invite').click();

      await browser.$('input[name=firstName]').setValue('Test');
      await browser.$('input[name=lastName]').setValue('User');
      await browser.$('input[name=email]').setValue('testy.o\'testface@example.com');

      await browser.$('label[for*="role-admin"]').click();

      await browser.$('button*=Send invitation').click();

      assert.ok(!await browser.$('.govuk-error-summary').isDisplayed(), 'No validation errors should be shown');
    });
  });

  describe('Invitations list', () => {

    it('can cancel, resend and delete an invitation', async() => {
      let emails;
      const EMAIL = 'testymctestface@example.com';
      const inviteTime = new Date();
      await invite(browser, EMAIL);

      emails = await getRecentEmailsFor(browser, EMAIL, 'invitation', inviteTime);
      assert.equal(emails.length, 1, 'invitation email sent');

      const url = await browser.getUrl();
      assert.ok(url.match(/\/invitations$/), 'redirects to invitations tab');

      await browser.$(`tr*=${EMAIL}`).$('button=Cancel').click();

      assert.ok(await browser.$(`tr*=${EMAIL}`).$('td*=Cancelled').isDisplayed(), 'invitation is cancelled');

      await browser.$(`tr*=${EMAIL}`).$('button=Resend').click();

      assert.ok(!await browser.$(`tr*=${EMAIL}`).$('td*=Cancelled').isDisplayed(), 'invitation is uncancelled');

      emails = await getRecentEmailsFor(browser, EMAIL, 'invitation', inviteTime);

      assert.equal(emails.length, 2, 'invitation email resent');

      await browser.$(`tr*=${EMAIL}`).$('button=Cancel').click();

      await browser.$(`tr*=${EMAIL}`).$('button=Delete').click();

      assert.ok(!await browser.$(`tr*=${EMAIL}`).isDisplayed());
    });

    it('cannot login with a cancelled token', async() => {
      const EMAIL = 'eveadams@example.com';
      const inviteTime = new Date();
      await invite(browser, EMAIL);

      const emails = await getRecentEmailsFor(browser, EMAIL, 'invitation', inviteTime);
      const acceptLink = _.get(emails, '[0].body.acceptLink');
      await browser.$(`tr*=${EMAIL}`).$('button=Cancel').click();

      await browser.withUser('newuser');
      await browser.url(acceptLink);

      assert.equal(await browser.$('h1').getText(), 'Invitation not found');
    });
  });

});
