import assert from 'assert';

describe('PIL Application', () => {
  it('can apply for a PIL', async () => {
    await browser.withUser('autoproject');

    await browser.url('/');
    await browser.$('h3=University of Croydon').click();
    await browser.$('.expanding-panel.open').$('a=Apply for personal licence').click();
    await browser.$('button=Apply now').click();

    console.log('Application started');

    // complete procedures
    await browser.$('a=Procedures').click();
    await browser.$('label*=B.').click();
    await browser.$('label*=D.').click();
    await browser.$('[name="notesCatD"]').setValue('Category D competency');
    await browser.$('label*=F.').click();
    await browser.$('[name="notesCatF"]').setValue('Category F type of procedure');
    await browser.$('button=Continue').click();

    console.log('Procedures completed');

    // complete animal types
    await browser.$('a=Animal types').click();
    await browser.$('summary=Small animals').click();
    await browser.$('label=Mice').click();
    await browser.$('label=Rats').click();
    await browser.$('summary=Other').click();
    await browser.$('.multi-input-item input').setValue('Jabu');
    await browser.$('button=Add another').click();
    await browser.$('.multi-input-item:last-of-type input').setValue('Babu');
    await browser.$('button=Continue').click();

    console.log('Animal types completed');

    // complete training
    await browser.$('a=Training').click();
    await browser.$('input[name="update"][value="false"]').click();
    await browser.$('button=Continue').click();

    console.log('Training completed');

    // submit
    await browser.$('[name="declaration"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Submit to NTCO').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    console.log('Submitted PIL application');
  });
});
