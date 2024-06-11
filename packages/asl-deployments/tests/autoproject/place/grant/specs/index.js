import assert from 'assert';

describe('Recommend place', async () => {
  it('can recommend a place', async () => {
    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();

    // find task in task list
    assert.ok(browser.$(`span=${process.env.PLACE_NAME}`).isDisplayed());
    console.log('Found task for place');
    await browser.$(`span=${process.env.PLACE_NAME}`).$('..').$('a').click();

    await browser.$('input[name="status"][value="resolved"]').click();

    await browser.$('button=Continue').click();

    await browser.$('button=Amend licence').click();

    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');
    console.log('Granted amendment');
  });

});
