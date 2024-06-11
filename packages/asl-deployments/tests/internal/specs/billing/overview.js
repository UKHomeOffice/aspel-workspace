import assert from 'assert';
import {gotoEstablishmentDashboard} from '../../helpers/establishment.js';

async function gotoEstablishmentBilling(establishment, year = '2019', status) {
  await browser.url('/');
  await gotoEstablishmentDashboard(browser, establishment, status);
  await browser.$('.panel-list').$('a=Licence fees').click();
  const url = await browser.getUrl();
  if (!url.includes(year)) {
    await browser.$('#year').selectByAttribute('value', year);
  }
}

describe('Billing', () => {
  before(async () => {
    await browser.withUser('asrusupport');
  });

  it('shows the number of billable PILs held an establishment', async () => {
    await gotoEstablishmentBilling('University of Life');
    const num = await browser.$('td=Number of licences held').$('..').$$('td')[1].getText();
    assert.equal(num, '3');
  });

  it('does not include PILs marked as non-billable', async () => {
    await gotoEstablishmentBilling('Marvell Pharmaceutical');
    const num = await browser.$('td=Number of licences held').$('..').$$(
      'td')[1].getText();
    assert.equal(num, '2');
    await browser.$('a=Billable personal licences').click();
    const count = await browser.$$('tbody tr');
    assert.equal(count.length, 3);
    const label = await browser.$('td=Andromache Hessentaler').$('..').$('td.waived').getText();
    assert.equal(label.toUpperCase(), 'NOT BILLABLE');
  });

  it('displays PILs which have been transferred under both establishments',
    async () => {
      await gotoEstablishmentBilling('Marvell Pharmaceutical');
      await browser.$('a=Billable personal licences').click();
      assert.ok(await browser.$('td=Dagny Aberkirder').isDisplayed());
      await gotoEstablishmentBilling('University of Croydon');
      await browser.$('a=Billable personal licences').click();
      assert.ok(await browser.$('td=Dagny Aberkirder').isDisplayed());
    });

  it('can search for users by full name in billable PILs list', async () => {
    await gotoEstablishmentBilling('University of Croydon');
    await browser.$('a=Billable personal licences').click();
    await browser.$('.search-box input[name="filter"]').setValue('Burgess Risborough');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('td*=Burgess Risborough').isDisplayed());
  });

  it('does not include a PEL fee for inactive establishments', async () => {
    await gotoEstablishmentBilling('Medium Pharma', '2019', 'Draft');
    const pelFee = await browser.$('td=Establishment licence fee').$('..').$$('td')[1].getText();
    assert.equal(pelFee, '£0');
    const num = await browser.$('td=Number of licences held').$('..').$$('td')[1].getText();
    assert.equal(num, '0');
  });

  it('asru admin cannot change the status of a pil to not billable',
    async () => {
      await browser.withUser('asruadmin');
      await gotoEstablishmentBilling('University of Life');
      await browser.$('a=Billable personal licences').click();
      await browser.$('td=HasLife Pil').click();
      const link = await browser.$('a=Change the billing status of this licence');
      const linkExists = await link.isExisting();
      assert(!linkExists, 'there should be no link to change the billable status');
    });

  it('asru support can change the status of a pil to not billable',
    async () => {
      await browser.withUser('asrusupport');
      await gotoEstablishmentBilling('University of Life');
      const num = await browser.$('td=Number of licences held').$('..').$$('td')[1].getText();
      assert.equal(num, '3');
      const pilFee = await browser.$('td=Fee for all personal licences').$('..').$$('td')[1].getText();
      assert.equal(pilFee, '£825');

      await browser.$('a=Billable personal licences').click();
      await browser.$('td=HasLife Pil').click();
      await browser.$('a=Change the billing status of this licence').click();
      await browser.$('textarea[name=comment]').setValue('Test comment');
      await browser.$('button=Update billable status').click();
      await browser.waitForSuccess();
      const label = await browser.$('td=HasLife Pil').$('..').$('td.waived').getText();
      assert.equal(label.toUpperCase(), 'NOT BILLABLE');

      await browser.$('a=Licence fees overview').click();
      const newNum = await browser.$('td=Number of licences held').$('..').$$('td')[1].getText();
      assert.equal(newNum, '2');
      const newPilFee = await browser.$('td=Fee for all personal licences').$('..').$$('td')[1].getText();
      assert.equal(newPilFee, '£550');
    });

  describe('consolidated billing information', () => {

    beforeEach(async () => {
      await browser.url('/licence-fees/2022');
    });

    it('shows totals for all establishments', async () => {
      const total = await browser.$('h3=Total licences').parentElement().$('h1').getText();
      // note: figure is one PIL less than the seeded value because test above marks one as unbillable
      assert.ok(total.match(/^£3[0-9]{1},[0-9]{3}$/), 'Total licence fees across all establishments is displayed');
    });

    it('shows per-establishment data', async () => {
      await browser.$('a=All establishments').click();
      assert.equal(
        await browser.$('td=Tiny Pharma').$('..').$('td.numberOfPils').getText(),
        '1', 'Per establishment total is displayed');
      assert.equal(
        await browser.$('td=Tiny Pharma').$('..').$('td.total').getText(),
        '£1,214', 'Per establishment total is displayed');
    });

  });

});
