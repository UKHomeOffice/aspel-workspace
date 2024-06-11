import assert from 'assert';
import { getRecentEmailsFor } from '../../../helpers/common.js';

const EMAIL = 'unverified@example.com';

describe('Email verification', () => {

  let emails = [];
  const start = new Date();

  it('receives a verification email when first logging in', async() => {
    await browser.withUser('unverified', 'a=Research and testing using animals');
    emails = await getRecentEmailsFor(browser, EMAIL, 'confirm-email', start);

    assert.equal(emails.length, 1);
  });

  it('can request a new verification email by clicking the resned button', async() => {
    await browser.$('button=Resend email').click();
    await browser.waitForSuccess();

    emails = await getRecentEmailsFor(browser, EMAIL, 'confirm-email', start);

    assert.equal(emails.length, 2);
  });

  it('can use the link in the email to verify their account', async() => {
    const acceptLink = emails[0].body.acceptLink;

    await browser.url(acceptLink);

    assert.ok(await browser.$('h1=Email address confirmed').isDisplayed());
    assert.ok(await browser.$('a=Continue').isDisplayed());

    await browser.$('a=Continue').click();

    assert.ok(await browser.$('h1=Hello Unverified').isDisplayed());
  });

});
