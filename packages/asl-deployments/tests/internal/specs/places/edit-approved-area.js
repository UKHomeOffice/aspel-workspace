import assert from 'assert';
import { applySiteFilter } from '../../../helpers/place.js';
import { gotoEstablishmentDashboard } from '../../helpers/establishment.js';

describe('Amend approved area', () => {

  it('can amend an approved area', async () => {

    await browser.withUser('inspector');
    await gotoEstablishmentDashboard(browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();

    await applySiteFilter(browser, 'Internal edit place tests');
    await browser.$('tbody').$('a=Default').click();

    await browser.$('a=Amend area').click();

    await browser.$('input[name="name"]').setValue('edited name');

    await browser.$('button*=Continue').click();

    assert.equal(await browser.$('span.highlight').getText(), 'edited name');

    await browser.$('button*=Submit').click();

    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');
  });

});
