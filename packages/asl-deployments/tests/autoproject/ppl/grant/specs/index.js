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

    // extend deadline
    await browser.$('summary=Extend deadline').click();
    await browser.$('a=Extend deadline').click();
    await browser
      .$('textarea[name="comment"]')
      .setValue('Reason for extending deadline');
    await browser.$('button=Extend deadline').click();
    assert.ok(await browser.$('p=Reason for extending deadline').isDisplayed());
    console.log('Extended deadline');

    await browser.$('a=View latest submission').click();

    await browser.$('a=Introductory details').click();

    assert.ok(
      await browser.$(`p=${process.env.PROJECT_TITLE}`).isDisplayed(),
      'Project title should be visible on introductory details review page'
    );
    console.log('Reviewed project');

    // complete conditions
    await browser.$('h3*=Additional conditions').click();
    await browser.$('a=Additional conditions').click();
    await Promise.all(
      [
        'Marmosets',
        'Animals taken from the wild',
        'Feral animals',
        'POLEs',
        'Non purpose bred schedule 2 animals',
        'Establishment licences not meeting Code of Practice'
      ].map(async (condition) => {
        assert.ok(
          await browser.$(`h3=${condition}`).isDisplayed(),
          `Condition "${condition}" should be visible`
        );
      })
    );

    // Animals taken from the wild
    await browser.$('.wild').$('button=Edit').click();
    const textarea = await browser.$('textarea');
    const value = await textarea.getValue();
    await textarea.setValue(
      value.replace('<<<INSERT animal type(s) HERE>>>', 'mice')
    );
    await browser.$('button=Save').click();

    await browser.waitForSync();
    console.log('Updated animals taken from the wild condition');

    // Feral animals
    await browser.$('.feral').$('button=Remove').click();

    await browser.waitForSync();
    console.log('Removed feral animals condition');

    await browser.$('button=Add more additional conditions').click();
    await browser.$('input[name="conditions"][value="batch-testing"]').click();
    await browser.$('button=Confirm').click();

    await browser.waitForSync();
    console.log('Added batch testing condition');

    // protocol conditions
    await browser.$('h3=Protocols').click();
    await browser.$('a=Protocols').click();
    await browser.$$('section.protocol')[0].click();
    let protocol = await browser.$$('section.protocol')[0];
    await protocol.$('h3*=Additional conditions').click();
    assert.ok(await browser.$('h3=POLEs').isDisplayed());

    // add custom condition
    await browser.$('button=Add another additional condition').click();
    await browser.$('textarea').setValue('Custom condition protocol 1');
    await browser.$('button=Save').click();
    console.log('custom condition added to first protocol');

    await browser.$$('section.protocol')[0].$('h3*=Authorisations').click();
    await Promise.all(
      [
        'Re-use',
        'Continued use on to a protocol',
        'Continued use off a protocol on to another protocol in this project',
        'Continued use off protocol on to another project'
      ].map(async (authorisation) => {
        assert.ok(
          await browser.$(`h3=${authorisation}`).isDisplayed(),
          `Authorisation "${authorisation}" should be visible`
        );
      })
    );

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
