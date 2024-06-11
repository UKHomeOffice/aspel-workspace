import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';

describe('Apply for a PEL', () => {

  it('can submit PEL application', async () => {
    await browser.withUser('holc');
    await gotoEstablishment(browser, 'Big Pharma');

    await browser.$('a=Apply for an establishment licence').click();

    assert(await browser.$('dd=Individual PEL').isDisplayed(), 'Individual PEL is displayed');
    assert(await browser.$('dt=Establishment licence holder (PELH)').isDisplayed(), 'Establishment Licence Holder (PELH) is displayed');
    assert(!await browser.$('dt=Named Person Responsible for Compliance (NPRC)').isDisplayed(), 'Named Person Responsible for Compliance (NPRC) is not displayed');

    await browser.$('input[name="declaration"][value="true"]').click();
    await browser.$('button=Submit').click();

    await browser.waitForSuccess();

    assert.ok(await browser.$('h1=Submitted').isDisplayed());
  });

});
