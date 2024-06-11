import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

describe('Update project issue date', () => {

  it('ASRU licensing does not have action to change the issue date', async () => {
    await browser.withUser('licensing');
    await gotoProjectLandingPage(browser, 'Active project wrong issue date');
    assert(!await browser.$('a[href*="/update-issue-date"]').isDisplayed(), 'Change issue date link should not be displayed');
  });

  it('ASRU inspector has action to change the issue date', async () => {
    await browser.withUser('inspector');
    await gotoProjectLandingPage(browser, 'Active project wrong issue date');
    assert(browser.$('a[href*="/update-issue-date"]').isDisplayed(), 'Change issue date link should be displayed');
  });

  it('Cannot set an issue date in the future', async () => {
    await browser.withUser('inspector');
    await gotoProjectLandingPage(browser, 'Active project wrong issue date');
    await browser.$('a[href*="/update-issue-date"]').click();

    await browser.$('input[name=newIssueDate-day]').setValue('12');
    await browser.$('input[name=newIssueDate-month]').setValue('12');
    await browser.$('input[name=newIssueDate-year]').setValue('2050');
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.govuk-error-message').getText(), 'Date granted cannot be in the future', 'Error should be thrown when attempting to submit future date');
  });

  it('Setting an issue date that will expire the licence displays a warning message', async () => {
    await browser.withUser('inspector');
    await gotoProjectLandingPage(browser, 'Active project wrong issue date');
    await browser.$('a[href*="/update-issue-date"]').click();

    await browser.$('input[name=newIssueDate-day]').setValue('12');
    await browser.$('input[name=newIssueDate-month]').setValue('12');
    await browser.$('input[name=newIssueDate-year]').setValue('2012');
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.govuk-warning-text__text').getText(), 'This change will result in an expiry date that\'s in the past. This means the licence will expire immediately.', 'Warning should be shown if the licence will be expired');
  });

  it('ASRU inspector can update the issue date', async () => {
    await browser.withUser('inspector');
    await gotoProjectLandingPage(browser, 'Active project wrong issue date');
    await browser.$('a[href*="/update-issue-date"]').click();

    await browser.$('input[name=newIssueDate-day]').setValue('12');
    await browser.$('input[name=newIssueDate-month]').setValue('12');
    await browser.$('input[name=newIssueDate-year]').setValue('2023');
    await browser.$('button=Continue').click();

    assert(!await browser.$('.govuk-warning-text__text').isDisplayed(), 'No warning should be shown if change will not cause licence expiry');

    await browser.$('button=Update now').click();
    await browser.waitForSuccess();
    assert(browser.$('.document-header').$('h2=Active project wrong issue date').isDisplayed(), 'The user should be returned to the project landing page');
    assert(browser.$('dd*=12 December 2023').isDisplayed(), 'The issue date should be updated');
    assert(browser.$('dd=12 December 2028').isDisplayed(), 'The expiry date should be updated to reflect new issue date');
  });

});
