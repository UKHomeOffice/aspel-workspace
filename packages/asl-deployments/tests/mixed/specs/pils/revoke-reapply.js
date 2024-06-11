import assert from 'assert';
import moment from 'moment';
import { gotoProfilePage } from '../../../internal/helpers/profile.js';
import { gotoEstablishmentDashboard } from '../../../internal/helpers/establishment.js';
import { gotoProfile } from '../../../public/helpers/profile.js';

const gotoBillablePils = async (browser, establishmentName) => {
  await gotoEstablishmentDashboard(browser, establishmentName);
  await browser.$('.panel-list').$('a=Licence fees').click();
  await browser.$('a=Billable personal licences').click();

  // switch to the current year if it is after April 5th
  const now = moment();
  const endOfPeriod = moment().set({ month: 3, date: 5 }).endOf('day');
  if (now.isAfter(endOfPeriod)) {
    await browser.$('select[name="year"]').selectByAttribute('value', now.get('year'));
    await browser.$('table:not(.loading)').waitForExist();
  }

  await browser.$('input[name="filter"]').setValue('Charisse');
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();
};

describe('Re-issuing a Revoked PIL', () => {
  before(async () => {
    await browser.withUser('licensing');
  });

  it('appears in the billing for Croydon', async () => {
    await gotoBillablePils(browser, 'University of Croydon');
    assert(await browser.$('td=Charisse Higgen').isDisplayed());
  });

  it('does not initially appear in the billing for Marvell Pharma', async () => {
    await gotoBillablePils(browser, 'Marvell Pharaceutical');
    assert(!(await browser.$('td=Charisse Higgen').isDisplayed()));
  });

  it('can be revoked and then re-issued at different establishment', async () => {
    // revoke existing PIL at Croydon
    await gotoProfilePage(browser, 'Charisse Higgen');
    await browser.$('h3=University of Croydon').click();
    await browser.$('//section[contains(@class,"open")]//a[contains(@href, "/pil")]').click();
    await browser.$('a=Revoke licence').click();
    await browser.$('[name="comments"]').setValue('Testing revoke reapply');
    await browser.$('button=Continue').click();
    await browser.$('button=Submit').click();

    await browser.withUser('pharmaadmin');
    await gotoProfile(browser, 'Charisse Higgen', 'Marvell Pharmaceutical');
    await browser.$('a=Reapply for personal licence').click();
    await browser.$('button=Apply now').click();

    await browser.$('a=Procedures').click();
    await browser.$('label[for*="procedures-a"]').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Animal types').click();
    await browser.$('summary=Small animals').click();
    await browser.$('label=Ferrets').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Training').click();
    await browser.$('label=No, this training record is up to date').click();
    await browser.$('button=Continue').click();

    await browser.$('label[for*="declaration-true"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Submit to NTCO').click();
    assert.ok(await browser.$('.success=Submitted').isDisplayed());

    await browser.withUser('marvellntco');
    await browser.$('.tasklist').$('td*=Charisse Higgen').$('a=PIL application').click();
    await browser.$('label[for*=status-endorsed]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Endorse application').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');

    await browser.withUser('licensing');
    await browser.gotoOutstandingTasks();
    await browser.$('.tasklist').$('td*=Charisse Higgen').$('a=PIL application').click();
    await browser.$('label[for*=status-resolved]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Grant licence').click();

    await browser.withUser('asrusuper');
    await gotoEstablishmentDashboard(await browser, 'Marvell Pharaceutical');
    await browser.$('a=Personal licences').click();
    assert(await browser.$('td=Charisse Higgen').isDisplayed());
  });

  it('now appears in the billing for Marvell Pharma with the correct start date', async () => {
    const now = moment();
    await gotoBillablePils(await browser, 'Marvell Pharmaceutical');
    assert(await browser.$('td=Charisse Higgen').isDisplayed());
    const row = await browser.$('td=Charisse Higgen').closest('tr');
    assert.deepStrictEqual(await row.$('td.startDate').getText(), now.format('D MMM YYYY'));
  });

  it('still appears in the billing for Croydon, with the correct end date', async () => {
    const now = moment();
    await gotoBillablePils(await browser, 'University of Croydon');
    assert(await browser.$('td=Charisse Higgen').isDisplayed());
    const row = await browser.$('td=Charisse Higgen').closest('tr');
    assert.deepStrictEqual(await row.$('td.endDate').getText(), now.format('D MMM YYYY'));
  });
});
