import assert from 'assert';
import { selectNacwos, selectNVSSQPs } from '../../../helpers/place.js';
import { gotoEstablishment } from '../../helpers/establishment.js';

describe('Create approved area', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  beforeEach(async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();
  });

  it('will display a notification message after successful form submit', async() => {
    const expected = [
      'University of Croydon',
      'XCC09J64D',
      'Bruce Banner',
      'site',
      'area',
      'name',
      'SA',
      'STH',
      'Ian Ayers, John Sharp',
      'Nathan Peters'
    ];

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

    await selectNacwos(browser, ['Ian Ayers', 'John Sharp']);
    await selectNVSSQPs(browser, ['Nathan Peters']);

    await browser.$('.editable-field').$('a=Add').click();
    await browser.$('.editable-field textarea').setValue('Dogs should be kept out of sight of cats');
    await browser.$('.editable-field button').click();

    await browser.$('textarea[name=comments]').setValue('test');
    await browser.$('button*=Continue').click();

    assert.equal(await browser.$('h1').getText(), 'Confirm addition');

    assert(
      await browser.$$('dl dd').every(async elem => expected.includes(await elem.getText()))
    );
    assert.equal(await browser.$('.field p').getText(), 'test');
    assert.equal(await browser.$('.editable-field .highlight').getText(), 'Dogs should be kept out of sight of cats');

    await browser.$('input[name="declaration"]').click();
    await browser.$('button*=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'New approved area');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });

  it('can edit the submitted data for the new area', async() => {
    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$('a=New approved area').click();
    await browser.$('label=Recall amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Recall amendment').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'New approved area');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');

    await browser.url('/');
    await browser.$('a=New approved area').click();
    await browser.$('label=Edit and resubmit the amendment').click();
    await browser.$('button=Continue').click();

    await selectNacwos(browser, ['Megan Alberts', 'Gareth Tindall']);

    await browser.$('button=Continue').click();

    await browser.$('input[name="declaration"]').click();
    await browser.$('button*=Submit').click();
    await browser.$('button=Edit and resubmit the amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'New approved area');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$('a=New approved area').click();

    assert.ok(await browser.$('dd=Megan Alberts, Gareth Tindall').isExisting());

    await browser.$('label=Discard amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Discard amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'New approved area');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');
  });

  it('will display creation form on edit', async() => {
    const expected = ['SA', 'STH'];

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

    await selectNacwos(browser, ['Ian Ayers']);

    await browser.$('textarea[name=comments]').setValue('test');
    await browser.$('button=Continue').click();
    await browser.$('a=Edit').click();

    assert.equal(await browser.$('input#site').getValue(), 'site');
    assert.equal(await browser.$('input#area').getValue(), 'area');
    assert.equal(await browser.$('input[name=name]').getValue(), 'name');
    assert(
      await browser
        .$$('input:checked')
        .every(async elem => expected.indexOf(await elem.getValue()) > -1)
    );

    const selectedOpts = await browser.$$('select[name=nacwos] option')
      .filter(async(opt) => await opt.getAttribute('selected') && await opt.getAttribute('selected') === 'true');

    assert(selectedOpts.some(async(element) => await element.getText() === 'Ian Ayers'));
  });

});
