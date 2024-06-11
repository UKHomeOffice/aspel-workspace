import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';

const AUTO_COMPLETE_DELAY = 500;

describe('Amend establishment details', () => {
  beforeEach(async () => {
    await browser.withUser('holc');
    await gotoEstablishment(browser, 'Small Pharma');
    await browser.$('a=Establishment details').click();
  });

  it('can update the establishment details', async () => {
    await browser.$('a=Amend licence').click();

    await browser.$('input[name="corporateStatus"][value="non-profit"]').click();
    // need a short pause to let autocomplete initialise
    await browser.pause(AUTO_COMPLETE_DELAY);
    await browser.$('#pelh').autocomplete('Bruce Banner');

    await browser.$('label*=Methods of killing').click();
    await browser.$$('.repeater textarea')[0].setValue('A value');
    await browser.$$('.repeater textarea')[1].setValue('A description');
    await browser.$('textarea[name=comments]').setValue('Some comments');
    await browser.$('button=Continue').click();

    await browser.$('input[name=declaration]').click();
    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Establishment amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });

  it('can recall the amendment', async () => {
    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$('td=Small Pharma').$('..').$('a=Establishment amendment').click();
    await browser.$('label=Recall amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Recall amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Establishment amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');
  });

  it('can edit and resubmit the amendment', async () => {
    await browser.url('/');
    await browser.$('td=Small Pharma').$('..').$('a=Establishment amendment').click();
    await browser.$('label=Edit and resubmit the amendment').click();
    await browser.$('button=Continue').click();
    await browser.$$('.repeater textarea')[0].setValue('A new value');

    await browser.$('button=Continue').click();
    await browser.$('input[name=declaration]').click();
    await browser.$('button=Submit').click();
    await browser.$('button=Edit and resubmit the amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Establishment amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$('td=Small Pharma').$('..').$('a=Establishment amendment').click();

    assert.ok(await browser.$('dd=A new value').isExisting());
  });
});
