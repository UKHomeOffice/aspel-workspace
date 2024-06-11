import assert from 'assert';
import moment from 'moment';
import { gotoProjectManagementPage, gotoProjectLandingPage, gotoProjectSearch } from '../../helpers/project.js';
import { gotoEstablishmentDashboard } from '../../helpers/establishment.js';

const performSearch = async (browser, term) => {
  await browser.$('.search-box input[type="text"]').waitForDisplayed();
  await browser.$('.search-box input[type="text"]').setValue(term);
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();
};

describe('Suspend Project', () => {

  it('inspector can suspend a project', async () => {
    await browser.withUser('inspector');
    await gotoProjectManagementPage(browser, 'Suspend PPL');
    await browser.$('a=Suspend licence').click();

    await browser.$('[name="comment"]').setValue('Misuse of protocol');
    await browser.$('button=Continue').click();

    assert.ok(browser.$('dd=Basic User').isDisplayed(), 'licence holder name should be visible');
    assert.ok(browser.$('dd=SUSP-1').isDisplayed(), 'licence number should be visible');
    assert.ok(browser.$('dd=Misuse of protocol').isDisplayed(), 'reason for suspension should be visible');
    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.ok(warningText.includes('will not be authorised to be carried out'), 'there should be a warning');

    await browser.$('button=Confirm suspension').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Suspended').isDisplayed());
    assert.ok(browser.$('p*=This licence has been suspended').isDisplayed());

    await browser.$('a*=view the history of this request').click();
    assert.ok(browser.$('h1=Project licence suspension').isDisplayed());
    assert.ok(browser.$('.badge=Approved').isDisplayed());
    assert.ok(browser.$('p=Misuse of protocol').isDisplayed(), 'reason for suspension should be visible');
  });

  it('Project is marked as suspended in the relevant places', async () => {
    await gotoProjectSearch(browser);
    await performSearch(browser, 'Suspend PPL');
    assert.ok(await (await browser.$('td*=Suspend PPL').closest('tr')).$('.badge=Suspended').isDisplayed());

    await gotoEstablishmentDashboard(browser, 'University of Croydon');
    await browser.$('a=Projects').click();
    await performSearch(browser, 'Suspend PPL');
    assert.ok(await (await browser.$('td*=Suspend PPL').closest('tr')).$('.badge=Suspended').isDisplayed());

    await gotoProjectLandingPage(browser, 'Suspend PPL');
    await browser.$('.licence-status-banner .toggle-switch').click();
    assert.ok(browser.$('.status').$('span=Suspended').isDisplayed());
    assert.strictEqual(await browser.$('li*=Suspended').$('.date').getText(), moment().format('DD MMMM YYYY'), 'the suspension date should be today');
  });

});

describe('Reinstate Project', () => {

  it('inspector can reinstate a suspended project', async () => {
    await browser.withUser('inspector');
    await gotoProjectManagementPage(browser, 'Suspend PPL');
    await browser.$('a=Reinstate licence').click();

    await browser.$('[name="comment"]').setValue('Protocol use corrected');
    await browser.$('button=Continue').click();

    assert.ok(browser.$('dd=Basic User').isDisplayed(), 'licence holder name should be visible');
    assert.ok(browser.$('dd=SUSP-1').isDisplayed(), 'licence number should be visible');
    assert.ok(browser.$('dd=Protocol use corrected').isDisplayed(), 'reason for reinstatement should be visible');
    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.ok(warningText.includes('will be authorised to be carried out'), 'there should be a warning');

    await browser.$('button=Confirm reinstatement').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Reinstated').isDisplayed());
    assert.ok(browser.$('p*=This licence has been reinstated').isDisplayed());

    await browser.$('a*=view the history of this request').click();
    assert.ok(browser.$('h1=Project licence reinstatement').isDisplayed());
    assert.ok(browser.$('.badge=Approved').isDisplayed());
    assert.ok(browser.$('p=Protocol use corrected').isDisplayed(), 'reason for reinstatement should be visible');

    await gotoProjectLandingPage(browser, 'Suspend PPL');
    assert.ok(!await browser.$('.licence-status-banner').isDisplayed(), 'the suspended banner should be removed');
  });

});

describe('Suspend then revoke project', () => {

  it('can still revoke a suspended project', async () => {
    await browser.withUser('inspector');
    await gotoProjectManagementPage(browser, 'Suspend PPL');
    await browser.$('a=Suspend licence').click();

    await browser.$('[name="comment"]').setValue('Misuse of protocol');
    await browser.$('button=Continue').click();
    await browser.$('button=Confirm suspension').click();
    await browser.waitForSuccess();
    assert.ok(browser.$('h1=Suspended').isDisplayed());

    await gotoProjectManagementPage(browser, 'Suspend PPL');
    await browser.$('a=Revoke licence').click();
    await browser.$('[name="comments"]').setValue('Revoke');
    await browser.$('button=Continue').click();
    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.ok(browser.$('h1=Revoked').isDisplayed());

    await gotoProjectLandingPage(browser, 'Suspend PPL');
    await browser.$('.licence-status-banner .toggle-switch').click();
    assert.ok(browser.$('.status').$('span=Revoked').isDisplayed());
  });

});
