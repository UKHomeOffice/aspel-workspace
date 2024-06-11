import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';

describe('PIL Lists', () => {
  it('can sort by licence number', async () => {
    await browser.withUser('holc');
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=Personal licences').click();
    await browser.$('a=Licence number').click();

    await browser.$('table:not(.loading)').waitForExist();

    const licenceNumber = await browser.$('table tbody tr:first-child td.licenceNumber').getText();

    assert.equal(licenceNumber, 'AK-178133');
  });
});
