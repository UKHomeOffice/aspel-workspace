import assert from 'assert';

describe('Resubmit PPL', async () => {

  it('can be resubmitted', async () => {
    await browser.withUser('autoproject');
    await browser.url('/');

    await browser.gotoOutstandingTasks();

    // find task in task list
    assert.ok(await browser.$(`[title="${process.env.PROJECT_TITLE}"]`).isDisplayed());
    console.log('Found task for project');
    await browser.$(`[title="${process.env.PROJECT_TITLE}"]`).$('a=PPL application').click();

    await browser.$('label=Edit and resubmit the application').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();
    await browser.$('button=Submit PPL application').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Project application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    console.log('Resubmitted application');
  });

  it('must be re-endorsed on submit', async () => {
    await browser.withUser('holc');
    await browser.url('/');

    await browser.gotoOutstandingTasks();

    // find task in task list
    assert.ok(await browser.$(`[title="${process.env.PROJECT_TITLE}"]`).isDisplayed());
    console.log('Found task for project');
    await browser.$(`[title="${process.env.PROJECT_TITLE}"]`).$('a=PPL application').click();

    await browser.$('label=Endorse application').click();
    await browser.$('button=Continue').click();

    await Promise.all(
      await browser.$$('.govuk-date-input').map(async dateGroup => {
        await dateGroup.$('input[type="number"][name*="day"]').setValue('01');
        await dateGroup.$('input[type="number"][name*="month"]').setValue('01');
        await dateGroup.$('input[type="number"][name*="year"]').setValue('2021');
      })
    );
    await browser.$('button=Endorse application').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Project application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');

    console.log('Endorsed application');
  });

});
