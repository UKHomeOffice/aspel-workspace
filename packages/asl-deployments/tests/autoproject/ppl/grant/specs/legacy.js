import assert from 'assert';

describe('PPL Grant', async () => {
  it('can grant a PPL', async () => {
    await browser.withUser('inspector');

    await browser.gotoOutstandingTasks();

    // find task in task list
    assert.ok(
      await browser.$(`[title="${process.env.PROJECT_TITLE}"]`).isDisplayed()
    );
    console.log('Found task for project');
    await browser
      .$(`[title="${process.env.PROJECT_TITLE}"]`)
      .$('a=PPL application')
      .click();

    await browser.$('a=View latest submission').click();

    await browser.$('a=Introductory details').click();

    assert.ok(
      await browser.$('a=Auto Project').isDisplayed(),
      'Licence holder should be visible on introductory details page'
    );
    assert.ok(
      await browser.$(`p=${process.env.PROJECT_TITLE}`).isDisplayed(),
      'Project title should be visible on introductory details review page'
    );
    console.log('Reviewed project');

    await browser.$('a=View all sections').click();

    await browser.$('a=Additional conditions').click();

    await browser.$('a=Edit').click();
    await browser
      .$('textarea[name="content"]')
      .setValue('Additional custom condition');
    await browser.$('button=Save').click();

    await browser.waitForSync();

    await browser.$('a=View all sections').click();

    await browser.$('a=Continue').click();

    await browser.$('input[name="status"][value="resolved"]').click();

    await browser.$('button=Continue').click();

    await browser.completeHba();

    await browser.$('button=Grant licence').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Project application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');
    console.log('Granted licence');
  });
});
