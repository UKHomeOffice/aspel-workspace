import assert from 'assert';
import { selectNacwos, selectNVSSQPs } from '../../../helpers/place.js';
import { gotoEstablishment } from '../../helpers/establishment.js';

describe('Approved area regression tests', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  beforeEach(async() => {
    await gotoEstablishment(await browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();
  });

  it('shows the correct count when no filters are active', async() => {
    const text = await browser.$('.filter-summary').getText();
    assert.ok(text.match(/All [\d]+ approved areas/));
  });

  it('allows adding an area with restrictions if the user does not click "Done"', async() => {
    await browser.$('a*=Create').click();
    await browser.$('input#site').setValue('site');
    await browser.$('input#area').setValue('area');
    await browser.$('input[name=name]').setValue('name');
    await browser
      .$('#suitability')
      .$('label*=SA')
      .click();

    await browser
      .$('#holding')
      .$('label*=STH')
      .click();

    selectNacwos(await browser, ['Ian Ayers', 'John Sharp']);
    selectNVSSQPs(await browser, ['Nathan Peters']);

    await browser.$('.editable-field').$('a=Add').click();
    await browser.$('.editable-field textarea').setValue('Some restrictions');
    // do not click "Done" button here

    await browser.$('textarea[name=comments]').setValue('test');
    await browser.$('button*=Continue').click();

    assert.equal(await browser.$('.editable-field .highlight').getText(), 'Some restrictions');

    await browser.$('input[name="declaration"]').click();
    await browser.$('button*=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'New approved area');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });

});
