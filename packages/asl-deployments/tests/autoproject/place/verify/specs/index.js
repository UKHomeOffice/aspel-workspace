import assert from 'assert';

describe('Verify place', async () => {
  it('verifies the changes have been made as expected', async () => {
    await browser.withUser('inspector');
    await browser.gotoCompletedTasks();

    // find task in task list
    assert.ok(await browser.$(`span=${process.env.PLACE_NAME}`).isDisplayed());
    console.log('Found task for place');
    await browser.$$(`span=${process.env.PLACE_NAME}`)[0].$('..').$('a').click();

    assert.ok(await browser.$('td=LA, SA').isDisplayed());
    assert.equal(await browser.$('span=LA').getAttribute('class'), 'highlight');

    assert.ok(await browser.$('td=STH').isDisplayed());
    assert.equal(await browser.$('span=LTH').getAttribute('class'), 'highlight');

    assert.ok(await browser.$('p=Dogs should be kept out of sight of cats').isDisplayed());
    assert.equal(await browser.$('div=Dogs should be kept with cats for company.').getAttribute('class'), 'highlight');

    assert.ok(await browser.$('p=Edited comment').isDisplayed());
  });
});
