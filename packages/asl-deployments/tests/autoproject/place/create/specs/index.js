import assert from 'assert';

describe('Create place', async () => {
  it('can create a place', async () => {
    await browser.withUser('holc');
    await browser.gotoPlaces();

    await browser.$('a*=Create').click();
    await browser.$('input#site').setValue('Autoproject site');
    await browser.$('input#area').setValue('Autoproject area');
    await browser.$('input[name=name]').setValue(process.env.PLACE_NAME);
    await browser
      .$('#suitability')
      .$('label*=SA')
      .click();

    await browser
      .$('#suitability')
      .$('label*=LA')
      .click();

    await browser
      .$('#holding')
      .$('label*=STH')
      .click();

    await browser.selectMany('nacwos', ['Ian Ayers', 'John Sharp']);
    await browser.selectMany('nvssqps', ['Nathan Peters']);

    await browser.$('.editable-field').$('a=Add').click();
    await browser.$('.editable-field textarea').setValue('Dogs should be kept out of sight of cats');
    await browser.$('.editable-field button').click();

    await browser.$('textarea[name=comments]').setValue('test');
    await browser.$('button*=Continue').click();

    assert.equal(await browser.$('h1').getText(), 'Confirm addition');

    assert.equal(await browser.$('.field p').getText(), 'test');
    assert.equal(await browser.$('.editable-field .highlight').getText(), 'Dogs should be kept out of sight of cats');

    await browser.$('input[name="declaration"]').click();
    await browser.$('button*=Submit').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'New approved area');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });
});
