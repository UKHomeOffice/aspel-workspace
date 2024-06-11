import assert from 'assert';

describe('Return PPL to applicant', async () => {

  it('can be returned to applicant', async () => {

    await browser.withUser('inspector');
    await browser.url('/');

    await browser.gotoOutstandingTasks();

    // find task in task list
    assert.ok(await browser.$(`[title="${process.env.PROJECT_TITLE}"]`).isDisplayed());
    console.log('Found task for project');
    await browser.$(`[title="${process.env.PROJECT_TITLE}"]`).$('a=PPL application').click();

    await browser.$('label=Return with comments').click();
    await browser.$('button=Continue').click();
    await browser.$('[name="comment"]').setValue('No way José');
    await browser.$('button=Return with comments').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Project application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Returned');

    console.log('Returned application');
  });

});
