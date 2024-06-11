import assert from 'assert';
import moment from 'moment';
import { gotoEstablishmentDashboard, gotoEstablishmentDetails, gotoEstablishmentSearch, performSearch } from '../../helpers/establishment.js';
import { gotoPIL } from '../../helpers/profile.js';
import { gotoProjectLandingPage } from '../../helpers/project.js';

describe('Suspend Establishment', () => {

  it('inspector can suspend an establishment', async () => {
    await browser.withUser('inspector');
    await gotoEstablishmentDetails(browser, 'MedTech');
    await browser.$('a=Suspend licence').click();

    await browser.$('[name="comment"]').setValue('Serious concerns');
    await browser.$('button=Continue').click();

    await browser.$('h1=Confirm establishment licence suspension').waitForDisplayed();

    assert.ok(browser.$('dd=Fabian Petegre').isDisplayed(), 'pel holder name should be visible');
    assert.ok(browser.$('dd=TEST-SUSP').isDisplayed(), 'licence number should be visible');
    assert.ok(browser.$('dd=Serious concerns').isDisplayed(), 'reason for suspension should be visible');
    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.ok(warningText.includes('will not be authorised to apply regulated procedures'), 'there should be a warning');

    await browser.$('button=Confirm suspension').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Suspended').isDisplayed());
    assert.ok(browser.$('p*=This licence has been suspended').isDisplayed());

    await browser.$('a*=view the history of this request').click();
    assert.ok(browser.$('h1=Establishment licence suspension').isDisplayed());
    assert.ok(browser.$('.badge=Approved').isDisplayed());
    assert.ok(browser.$('p=Serious concerns').isDisplayed(), 'reason for suspension should be visible');
  });

  it('The establishment licence is marked as suspended in the relevant places', async () => {
    await gotoEstablishmentSearch(browser);
    await performSearch(browser, 'MedTech');
    assert.ok(await (await browser.$('td*=MedTech').closest('tr')).$('.badge=Suspended').isDisplayed());

    await gotoEstablishmentDashboard(browser, 'MedTech');
    await browser.$('.licence-status-banner .toggle-switch').click();
    assert.ok(browser.$('.status').$('span=Suspended').isDisplayed());
    assert.strictEqual(await browser.$('li*=Suspended').$('.date').getText(), moment().format('DD MMMM YYYY'), 'the suspension date should be today');
  });

  it('All PILs at the establishment are also marked as suspended', async () => {
    await gotoPIL(browser, 'Dave Leason');
    await browser.$('.licence-status-banner .toggle-switch').click();
    assert.ok(browser.$('.status').$('span=Related establishment licence suspended').isDisplayed());
    assert.ok(browser.$('.status-details').$(`span*=MedTech's establishment licence is not active`).isDisplayed());
    assert.strictEqual(await browser.$('li*=Suspended').$('.date').getText(), moment().format('DD MMMM YYYY'), 'the suspension date should be today');
  });

  it('All PPLs at the establishment are also marked as suspended', async () => {
    await gotoProjectLandingPage(browser, 'Suspend Establishment');
    await browser.$('.licence-status-banner .toggle-switch').click();
    assert.ok(browser.$('.status').$('span=Related establishment licence suspended').isDisplayed());
    assert.ok(browser.$('.status-details').$(`span*=MedTech's establishment licence is not active`).isDisplayed());
    assert.strictEqual(await browser.$('li*=Suspended').$('.date').getText(), moment().format('DD MMMM YYYY'), 'the suspension date should be today');
  });

});

describe('Reinstate Establishment', () => {

  it('inspector can reinstate a suspended establishment', async () => {
    await browser.withUser('inspector');
    await gotoEstablishmentDetails(browser, 'MedTech');
    await browser.$('a=Reinstate licence').click();

    await browser.$('[name="comment"]').setValue('Concerns diminished');
    await browser.$('button=Continue').click();

    assert.ok(browser.$('dd=Fabian Petegre').isDisplayed(), 'pel holder name should be visible');
    assert.ok(browser.$('dd=TEST-SUSP').isDisplayed(), 'licence number should be visible');
    assert.ok(browser.$('dd=Concerns diminished').isDisplayed(), 'reason for reinstatement should be visible');
    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.ok(warningText.includes('establishment will be authorised to apply regulated procedures'), 'there should be a warning');

    await browser.$('button=Confirm reinstatement').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Reinstated').isDisplayed());
    assert.ok(browser.$('p*=This licence has been reinstated').isDisplayed());

    await browser.$('a*=view the history of this request').click();
    assert.ok(browser.$('h1=Establishment licence reinstatement').isDisplayed());
    assert.ok(browser.$('.badge=Approved').isDisplayed());
    assert.ok(browser.$('p=Concerns diminished').isDisplayed(), 'reason for reinstatement should be visible');

    await gotoEstablishmentDetails(browser, 'MedTech');
    assert.ok(!await browser.$('.licence-status-banner').isDisplayed(), 'the suspended banner should be removed');
  });

});
