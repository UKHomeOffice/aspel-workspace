import assert from 'assert';

describe('PPL endorsement', async () => {

  it('can be endorsed by an admin user', async () => {
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
      await browser.$$('.govuk-date-input')
        .map(async dateGroup => {
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
