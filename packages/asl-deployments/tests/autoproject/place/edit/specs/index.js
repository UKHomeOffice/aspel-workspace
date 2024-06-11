import assert from 'assert';

describe('Edit place', async () => {
  it('can edit a place', async () => {
    await browser.withUser('holc');
    await browser.gotoPlaces();
    await browser.$('a=Filter areas').click();
    await browser.$('#site-label').click();
    await browser.$('label=Autoproject site').click();
    await browser.$('button=Apply filters').click();

    await browser.$('table:not(.loading) th a:not(.disabled)').waitForExist();

    // sort table twice so most recently created _should_ be at the top
    await browser.$('thead').$('a=Name').click();
    await browser.$('table:not(.loading) th a:not(.disabled)').waitForExist();

    await browser.$('thead').$('a=Name').click();
    await browser.$('table:not(.loading) th a:not(.disabled)').waitForExist();

    await browser.$(`a=${process.env.PLACE_NAME}`).click();

    await browser.$('a=Amend area').click();

    // deselect SA
    await browser
      .$('#suitability')
      .$('label*=SA')
      .click();

    // deselect STH
    await browser
      .$('#holding')
      .$('label*=STH')
      .click();

    // select LTH
    await browser
      .$('#holding')
      .$('label*=LTH')
      .click();

    await browser.selectMany('nacwos', ['Benjamin Patton']);
    await browser.selectMany('nvssqps', ['Aaron Harris']);

    await browser.$('.editable-field').$('a=Edit').click();
    await browser.$('.editable-field textarea').setValue('Dogs should be kept with cats for company.');
    await browser.$('.editable-field button').click();

    await browser.$('textarea[name=comments]').setValue('Edited comment');
    await browser.$('button*=Continue').click();

    await browser.$('input[name="declaration"]').click();
    await browser.$('button*=Submit').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });
});
