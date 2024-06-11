import assert from 'assert';
import { taskAssertions } from '../../utils/index.js';

describe('PPL Application', () => {
  it('can grant a PPL', async () => {
    await browser.withUser('licensing');
    await browser.gotoOutstandingTasks();

    // find task in task list
    assert.ok(await browser.$('td*=Auto Project').isDisplayed());
    console.log('Found task for PIL');
    await browser.$('td*=Auto Project').$('a=PIL application').click();

    await taskAssertions(browser);

    await browser.$('label=Grant licence').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Grant licence').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');
    console.log('Granted licence');
  });
});
