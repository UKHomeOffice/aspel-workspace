import assert from 'assert';
import moment from 'moment';
import { gotoPIL, gotoProfileSearch } from '../../helpers/profile.js';
import { gotoEstablishmentDashboard } from '../../helpers/establishment.js';

const performSearch = async (browser, term) => {
  await browser.$('.search-box input[type="text"]').waitForDisplayed();
  await browser.$('.search-box input[type="text"]').setValue(term);
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();
};

describe('Suspend PIL', () => {

  it('licencing cannot suspend a PIL', async () => {
    await browser.withUser('licensing');
    await gotoPIL(browser, 'Ignace Alsford');
    assert.ok(!await browser.$('a=Suspend licence').isDisplayed(), 'there should not be a suspend licence button');
  });

  it('inspector can suspend a PIL', async () => {
    await browser.withUser('inspector');
    await gotoPIL(browser, 'Ignace Alsford');
    await browser.$('a=Suspend licence').click();

    await browser.$('[name="comment"]').setValue('User has open enforcement case against them');
    await browser.$('button=Continue').click();

    assert.ok(browser.$('dd=Ignace Alsford').isDisplayed(), 'licence holder name should be visible');
    assert.ok(browser.$('dd=RK-263880').isDisplayed(), 'licence number should be visible');
    assert.ok(browser.$('dd=User has open enforcement case against them').isDisplayed(), 'reason for suspension should be visible');
    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.ok(warningText.includes('will not be authorised to carry out regulated procedures'), 'there should be a warning');

    await browser.$('button=Confirm suspension').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Suspended').isDisplayed());
    assert.ok(browser.$('p*=This licence has been suspended').isDisplayed());

    await browser.$('a*=view the history of this request').click();
    assert.ok(browser.$('h1=Personal licence suspension').isDisplayed());
    assert.ok(browser.$('.badge=Approved').isDisplayed());
    assert.ok(browser.$('p=User has open enforcement case against them').isDisplayed(), 'reason for suspension should be visible');
  });

  it('PIL is marked as suspended in the relevant places', async () => {
    await gotoProfileSearch(browser);
    await performSearch(browser, 'Ignace');
    assert.ok(await (await browser.$('td*=Ignace Alsford').closest('tr')).$('.badge=Suspended').isDisplayed());

    await gotoEstablishmentDashboard(browser, 'University of Croydon');
    await browser.$('a=People').click();
    await performSearch(browser, 'Ignace');
    assert.ok(await (await browser.$('td*=Ignace Alsford').closest('tr')).$('.badge=suspended').isDisplayed());

    await gotoPIL(browser, 'Ignace Alsford');
    await browser.$('.licence-status-banner .toggle-switch').click();
    assert.ok(browser.$('.status').$('span=Suspended').isDisplayed(), 'there should be a suspended banner');
    assert.strictEqual(await browser.$('li*=Suspended').$('.date').getText(), moment().format('DD MMMM YYYY'), 'the suspension date should be today');
  });

});

describe('Reinstate PIL', () => {

  it('inspector can reinstate a suspended PIL', async () => {
    await browser.withUser('inspector');
    await gotoPIL(browser, 'Ignace Alsford');
    await browser.$('a=Reinstate licence').click();

    await browser.$('[name="comment"]').setValue('All clear');
    await browser.$('button=Continue').click();

    assert.ok(browser.$('dd=Ignace Alsford').isDisplayed(), 'licence holder name should be visible');
    assert.ok(browser.$('dd=RK-263880').isDisplayed(), 'licence number should be visible');
    assert.ok(browser.$('dd=All clear').isDisplayed(), 'reason for reinstatement should be visible');
    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.ok(warningText.includes('will be authorised to carry out regulated procedures'), 'there should be a warning');

    await browser.$('button=Confirm reinstatement').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Reinstated').isDisplayed());
    assert.ok(browser.$('p*=This licence has been reinstated').isDisplayed());

    await browser.$('a*=view the history of this request').click();
    assert.ok(browser.$('h1=Personal licence reinstatement').isDisplayed());
    assert.ok(browser.$('.badge=Approved').isDisplayed());
    assert.ok(browser.$('p=All clear').isDisplayed(), 'reason for reinstatement should be visible');

    await gotoPIL(browser, 'Ignace Alsford');
    assert.ok(!await browser.$('.licence-status-banner').isDisplayed(), 'the suspended banner should be removed');
  });

});

describe('Suspend then revoke PIL', () => {

  it('can still revoke a suspended PIL', async () => {
    await browser.withUser('inspector');

    await gotoPIL(browser, 'Ignace Alsford');
    await browser.$('a=Suspend licence').click();
    await browser.$('[name="comment"]').setValue('Suspend');
    await browser.$('button=Continue').click();
    await browser.$('button=Confirm suspension').click();
    await browser.waitForSuccess();
    assert.ok(browser.$('h1=Suspended').isDisplayed());

    await gotoPIL(browser, 'Ignace Alsford');
    await browser.$('a=Revoke licence').click();
    await browser.$('[name="comments"]').setValue('Revoke');
    await browser.$('button=Continue').click();
    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.ok(browser.$('h1=Revoked').isDisplayed());

    await gotoPIL(browser, 'Ignace Alsford');
    await browser.$('.licence-status-banner .toggle-switch').click();
    assert.ok(browser.$('.status').$('span=Revoked').isDisplayed(), 'there should be a revoked banner');
  });

});
