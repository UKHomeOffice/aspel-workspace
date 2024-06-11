import assert from 'assert';
import { taskAssertions } from '../../utils/index.js';

describe('PIL Application', () => {
  it('can endorse a PIL', async () => {
    await browser.withUser('ntco');

    await browser.url('/');

    await browser.gotoOutstandingTasks();

    // find task in task list
    assert.ok(await browser.$('td*=Auto Project').isDisplayed());
    console.log('Found task for PIL');
    await browser.$('td*=Auto Project').$('a=PIL application').click();

    await taskAssertions(browser);

    console.log('Completed assertions');

    await browser.$('label=Endorse application').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Endorse application').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');

    console.log('Endorsed application');
  });
});
