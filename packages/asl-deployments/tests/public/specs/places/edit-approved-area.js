import assert from 'assert';
import { applySiteFilter, selectNacwos } from '../../../helpers/place.js';

import { gotoEstablishment } from '../../helpers/establishment.js';

describe('Amend approved area', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  beforeEach(async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();
  });

  it('will display a warning message if submitting with no changes', async() => {

    await applySiteFilter(browser, 'Public edit place tests');
    await browser.$('tbody').$('a=Default').click();

    await browser.$('a=Amend area').click();

    await browser.$('textarea[name=comments]').setValue('test removal reason');
    await browser.$('button*=Continue').click();

    assert.ok(await browser.$('li=No changes have been made').isExisting());

  });

  it('changes are highlighted on the confirmation screen', async() => {

    await applySiteFilter(browser, 'Public edit place tests');
    await browser.$('tbody').$('a=Default').click();

    await browser.$('a=Amend area').click();

    await browser.$('input[name="name"]').setValue('edited name');

    await browser.$('button*=Continue').click();

    assert.equal(await browser.$('span.highlight').getText(), 'edited name');

  });

  // regression test for bug with NACWO-less places
  it('changes are highlighted on the confirmation screen and work when there is no NACWO', async() => {

    await applySiteFilter(browser, 'Public edit place tests');
    await browser.$('tbody').$('a=No NACWO').click();

    await browser.$('a=Amend area').click();

    await selectNacwos(browser, ['Ian Ayers']);

    await browser.$('button*=Continue').click();

    assert.equal(await browser.$('span.highlight').getText(), 'Ian Ayers');

  });

  it('can edit an update task', async() => {
    const areaAmendmentForDefaultXPath = '//td[contains(.,"Area amendment") and contains(.,"Default")]//a';

    await applySiteFilter(browser, 'Public edit place tests');

    await browser.$('tbody').$('a=Default').click();

    await browser.$('a=Amend area').click();
    await browser.$('input[name="name"]').setValue('New name');
    await browser.$('textarea#comments').setValue('Reason for change');

    await browser.$('button=Continue').click();
    await browser.$('input[name="declaration"]').click();

    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');

    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$(areaAmendmentForDefaultXPath).click();

    assert.equal(await browser.$('span.highlight').getText(), 'New name');

    await browser.$('label=Recall amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Recall amendment').click();

    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');

    await browser.url('/');
    await browser.$(areaAmendmentForDefaultXPath).click();
    await browser.$('label=Edit and resubmit the amendment').click();
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('h1').getText(), 'Amend approved area');

    await browser.$('input[name="name"]').setValue('Edited name');
    await browser.$('button=Continue').click();
    await browser.$('input[name="declaration"]').click();
    await browser.$('button=Submit').click();
    await browser.$('button=Edit and resubmit the amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$(areaAmendmentForDefaultXPath).click();

    assert.equal(await browser.$('span.highlight').getText(), 'Edited name');

    await browser.$('label=Discard amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Discard amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');
  });

});
