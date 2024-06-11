import assert from 'assert';
import { gotoEstablishment } from '../../../public/helpers/establishment.js';
import { gotoEstablishmentDashboard } from '../../../internal/helpers/establishment.js';

const findTask = async (user) => {
  if (user === 'inspector') {
    await gotoEstablishmentDashboard(browser, 'University of Croydon');
  } else {
    await gotoEstablishment(browser, 'University of Croydon');
  }
  await browser.$('a=Approved areas').click();
  await browser.$('a=919').click();
  await browser.$('a=View task').click();
};

describe('Amend approved area', () => {
  it('user can edit and resubmit a returned amendment', async () => {
    await browser.withUser('holc');
    await browser.url('/');
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();
    await browser.$('a=919').click();
    await browser.$('a=Amend area').click();
    await browser.$('input[value=SA').click();
    await browser
      .$('textarea[name=comments]')
      .setValue('Reason for the change');
    await browser.$('button=Continue').click();
    await browser.$('input[name="declaration"][value="true"]').click();
    await browser.$('button=Submit').click();
    await browser.$('span=Submitted').waitForDisplayed();

    await browser.withUser('inspector');
    await browser.url('/');
    await findTask('inspector');
    await browser.$('input[value=returned-to-applicant]').click();
    await browser.$('button[type=submit]').click();
    await browser.$('textarea[id=comment]').setValue('Return reason');
    await browser.$('span=Return amendment with comments').click();
    await browser.$('button').click();
    await browser.$('span=Returned').waitForDisplayed();

    await browser.withUser('holc');
    await browser.url('/');
    await findTask('holc');
    await browser.$('input[value=updated]').click();
    await browser.$('button[type=submit]').click();

    await browser.$('input[value=DOG').click();
    await browser.$('button=Continue').click();
    await browser.$('input[name="declaration"][value="true"]').click();
    await browser.$('button[type=submit]').click();
    await browser.$('button').click();
    await browser.$('span=Submitted').waitForDisplayed();

    await browser.withUser('inspector');
    await browser.url('/');
    await findTask('inspector');

    await assert.ok(browser.$('abbr=DOG').isDisplayed());
  });
});
