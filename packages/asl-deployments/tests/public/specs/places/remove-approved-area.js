import assert from 'assert';
import { applySiteFilter } from '../../../helpers/place.js';
import { gotoEstablishment } from '../../helpers/establishment.js';

describe('Remove approved area', () => {
  it('will display a notification message after successful form submit', async() => {

    await browser.withUser('holc');
    await gotoEstablishment(await browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();

    await applySiteFilter(await browser, 'Public remove place tests');
    await browser.$('tbody').$('a=Default').click();

    await browser.$('a=Remove area').click();

    await browser.$('textarea[name=comments]').setValue('test removal reason');
    await browser.$('button*=Continue').click();

    assert.equal(await browser.$('h1').getText(), 'Confirm changes');
    assert.ok(await browser.$('p=test removal reason').isDisplayed(), 'Reason is played back to user');

    await browser.$('input[name="declaration"]').click();
    await browser.$('button*=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Area removal');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

  });

});
