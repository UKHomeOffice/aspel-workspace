import assert from 'assert';

import {
  gotoProjectManagementPage,
  completeAwerb
} from '../../../public/helpers/project.js';
import { findTask } from '../../../helpers/task.js';

describe('Project task recovery', () => {
  const TITLE = 'Project task recovery test';

  it('can recover a task after rejection', async () => {
    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, TITLE);
    await browser.$('button=Amend licence').click();
    await browser.$('button=Continue').click();
    await completeAwerb(browser);
    await browser.$('textarea[name="comment"]').setValue('some comments');
    await browser.$('textarea[name="comments"]').setValue('some comments');
    await browser.$('button*=Submit PPL amendment').click();

    assert.equal(
      await browser.$('h1.govuk-panel__title').getText(),
      'Submitted'
    );

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await (await findTask(browser, `[title="${TITLE}"]`))
      .$('..')
      .$('a=PPL amendment')
      .click();

    await browser.$('input[name="status"][value="rejected"]').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea[name="comment"]').setValue('Denied');
    await browser.$('button=Refuse amendment').click();
    assert.equal(
      await browser.$('h1.govuk-panel__title').getText(),
      'Refused'
    );

    await browser.withUser('asruadmin');

    await browser.$('a=Completed').click();
    await (await findTask(browser, `[title="${TITLE}"]`))
      .$('..')
      .$('a=PPL amendment')
      .click();

    assert.equal(await browser.$('span.badge').getText(), 'REFUSED');
    assert.ok(await browser.$('button=Reopen task').isDisplayed());

    await browser.$('button=Reopen task').click();
    await browser.acceptAlert();

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await (await findTask(browser, `[title="${TITLE}"]`))
      .$('..')
      .$('a=PPL amendment')
      .click();

    assert.equal(await browser.$('span.badge').getText(), 'AWAITING DECISION');
  });

  it('cannot recover a task after rejection if editing has continued (submitted version forked)', async () => {
    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await (await findTask(browser, `[title="${TITLE}"]`))
      .$('..')
      .$('a=PPL amendment')
      .click();

    await browser.$('input[name="status"][value="rejected"]').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea[name="comment"]').setValue('Denied');
    await browser.$('button=Refuse amendment').click();
    assert.equal(
      await browser.$('h1.govuk-panel__title').getText(),
      'Refused'
    );

    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, TITLE);

    // version forked
    await browser.$('button=Edit amendment').click();

    await browser.withUser('asruadmin');

    await browser.$('a=Completed').click();
    await (await findTask(browser, `[title="${TITLE}"]`))
      .$('..')
      .$('a=PPL amendment')
      .click();

    assert.equal(await browser.$('span.badge').getText(), 'REFUSED');
    assert.ok(!(await browser.$('button=Reopen task').isDisplayed()));
  });
});
