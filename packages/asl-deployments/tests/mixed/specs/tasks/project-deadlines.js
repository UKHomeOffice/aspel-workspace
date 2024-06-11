import assert from 'assert';
import moment from 'moment-business-time';
import { bankHolidays } from '@ukhomeoffice/asl-constants';

import { gotoProjectLandingPage } from '../../../internal/helpers/project.js';
import { gotoDraft, completeAwerb } from '../../../public/helpers/project.js';
import { findTask, searchForTask } from '../../../helpers/task.js';
import { findInPagination } from '../../../helpers/common.js';

const STANDARD_DEADLINE = 40;
const EXTENDED_DEADLINE = 55;

// configure bank holidays
moment.updateLocale('en', { holidays: bankHolidays });

const todayAsString = moment().format('D MMMM YYYY');
const originalDeadline = moment().addWorkingTime(STANDARD_DEADLINE, 'days').format('D MMMM YYYY');
const extendedDeadline = moment().addWorkingTime(EXTENDED_DEADLINE, 'days').format('D MMMM YYYY');

describe('Project Deadlines', () => {
  it('Displays the time left until the deadline in the task list', async () => {
    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();

    await findInPagination('//div[@title="Internal deadline past, statutory deadline future"]');

    const deadlineDueNotice = await browser
      .$('//div[@title="Internal deadline past, statutory deadline future"]/ancestor::tr//span[@class="notice"]')
      .getText();
    const dueDate = moment(await deadlineDueNotice.replace('(statutory)', '').trim(), 'D MMM YYYY');
    assert.ok((await dueDate.isValid()) && (await dueDate.isAfter()), 'valid future date should be displayed');

    const overdueNotice = await browser
      .$('//div[@title="Internal deadline past, statutory deadline past"]/ancestor::tr//span[@class="notice urgent"]')
      .getText();
    assert.equal(await overdueNotice, 'Overdue\n(statutory)');
  });

  it('Old style deadline extensions are still displayed correctly', async () => {
    const aMonthAgo = moment().subtract(1, 'month'); // test seed is offset a month in the past
    const extendedDeadline = moment(aMonthAgo).addWorkingTime(EXTENDED_DEADLINE, 'days').format('D MMMM YYYY');

    await browser.withUser('inspector');
    await gotoProjectLandingPage(browser, 'Testing deadline extension (old style)', 'Draft');
    await browser
      .$('table.tasklist')
      .$('[title="Testing deadline extension (old style)"]')
      .$('a=PPL application')
      .click();

    assert.ok(
      await browser.$('.task-details').$('a=Testing deadline extension (old style)').isDisplayed(),
      'the project name should be displayed and should link to the project'
    );
    const taskStatus = await browser.$('.task-status .badge').getText();
    assert.equal(await taskStatus, 'AWAITING DECISION', 'the status of the task should be awaiting decision');

    const deadline = await browser.$('.task-status .deadline h2').getText();
    assert.equal(
      deadline,
      `Process by: ${extendedDeadline}`,
      'the deadline date should be displayed under the task status'
    );

    const latestActivity = await browser.$$('.activity-log .log-item')[0];
    assert.equal(
      await latestActivity.$('.date').getText(),
      aMonthAgo.format('D MMMM YYYY'),
      'the date of the deadline extension should be displayed'
    );
    assert.equal(
      await latestActivity.$('p').getText(),
      'Deadline for decision extended by: Inspector Morse',
      'the name of the extender should be displayed'
    );
    assert.equal(
      await latestActivity.$('.comment .content').getText(),
      'Extending the deadline (old style)',
      'the comment made during extension should be displayed'
    );
  });

  it('Does not give the option to extend until ready', async () => {
    await browser.withUser('holc');

    await gotoDraft(browser, 'Testing deadline extension');
    await browser.$('button=Continue').click();
    await completeAwerb(browser);
    await browser.$('textarea[name=comment]').setValue('Submitting new project');
    await browser.$('button=Submit PPL application to Home Office').click();

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    const task = await findTask(browser, '[title="Testing deadline extension"]');
    await task.$('a=PPL application').click();

    assert.ok(
      await browser.$('.task-details').$('a=Testing deadline extension').isDisplayed(),
      'the project name should be displayed and should link to the project'
    );
    const taskStatus = await browser.$('.task-status .badge').getText();
    assert.equal(await taskStatus, 'AWAITING DECISION', 'the status of the task should be awaiting recommendation');
  });

  it('Once all declarations are completed, a deadline can be removed', async () => {
    await browser.withUser('inspector');

    await searchForTask('Testing deadline remove');
    await browser.$('table.tasks').$('[title="Testing deadline remove"]');
    await browser.$('a=PPL application').click();

    await browser.$('//summary[text()="Application not complete and correct"]').doubleClick();
    await browser.$('//a[contains(.,"Remove deadline")]').click();
    assert.ok(
      await browser.$('h1=Mark as not complete and correct').isDisplayed(),
      'the mark as not complete and correct confirm page should be displayed'
    );
    await browser.$('textarea[name=comment]').setValue('Removing deadline');
    await browser.$('button=Mark incomplete or incorrect').click();

    assert.ok(
      await browser
        .$('.task-status .deadline')
        .$('span=The application is not complete and correct so the statutory deadline is not applicable.'),
      'There should be a not complete and correct summary'
    );

    await searchForTask('Testing deadline remove');

    let xPathString = '//table[contains(@class,"tasks")]';
    xPathString += '//div[@title="Testing deadline remove"]';
    xPathString += '/ancestor::tr[@class="expanded"]';
    xPathString += '//td[@class="updatedAt"]';
    const updateAt = await browser.$(xPathString).getText();
    assert.equal(updateAt, '1 Jun 2020', 'the the task last changed should not have changed');
  });

  it('When a deadline has been removed, the deadline can be reinstated', async () => {
    await browser.withUser('inspector');

    await searchForTask('Testing deadline remove');
    await browser.$('table.tasks').$('[title="Testing deadline remove"]').$('a=PPL application').click();

    await browser.$('//summary[text()="Reinstate deadline"]').doubleClick();
    await browser.$('//a[contains(.,"Reinstate deadline")]').click();

    assert.ok(
      await browser.$('h1=Reinstate statutory deadline').isDisplayed(),
      'the mark as not complete and correct confirm page should be displayed'
    );
    await browser.$('textarea[name=comment]').setValue('Reinstating deadline');
    await browser.$('button=Reinstate deadline').click();

    assert.ok(
      await browser.$('.task-status .deadline').$('summary=Application not complete and correct').isDisplayed(),
      'There should be a not complete and correct option'
    );
    assert.ok(
      !(await browser
        .$('.task-status .deadline')
        .$('span=The application is not complete and correct so the statutory deadline is not applicable.')
        .isDisplayed()),
      'There should not be a not complete and correct summary'
    );

    await searchForTask('Testing deadline remove');

    let xPathString = '//table[contains(@class,"tasks")]';
    xPathString += '//div[@title="Testing deadline remove"]';
    xPathString += '/ancestor::tr[@class="expanded"]';
    xPathString += '//td[@class="updatedAt"]';
    const updateAt = await browser.$(xPathString).getText();
    assert.equal(updateAt, '1 Jun 2020', 'the the task last changed should not have changed');
  });

  it('returning the task resets the removed deadline when resubmitted', async () => {
    await browser.withUser('inspector');
    await searchForTask('Testing deadline remove');
    await browser.$('table.tasks').$('[title="Testing deadline remove"]').$('a=PPL application').click();

    await browser.$('//summary[text()="Application not complete and correct"]').doubleClick();
    await browser.$('//a[contains(.,"Remove deadline")]').click();

    await assert.ok(
      await browser.$('h1=Mark as not complete and correct').isDisplayed(),
      'the mark as not complete and correct confirm page should be displayed'
    );
    await browser.$('textarea[name=comment]').setValue('Removing deadline');
    await browser.$('button=Mark incomplete or incorrect').click();

    await browser.$('label=Return with comments').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea[name=comment]').setValue('Returning to Bruce to make ready');
    await browser.$('button=Return with comments').click();
    await browser.waitForSuccess();

    await browser.withUser('holc');

    const task = await findTask(browser, '[title="Testing deadline remove"]');
    await task.$('a=PPL application').click();

    await browser.$('label=Edit and resubmit the application').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await completeAwerb(browser);
    await browser.$('textarea[name=comment]').setValue('Submitting as ready');
    await browser.$('button=Submit PPL application to Home Office').click();
    await browser.waitForSuccess();

    await browser.withUser('inspector');

    await searchForTask('Testing deadline remove');
    await browser.$('table.tasks').$('[title="Testing deadline remove"]').$('a=PPL application').click();

    const newDeadline = moment().addWorkingTime(STANDARD_DEADLINE, 'days').format('D MMMM YYYY');
    assert.ok(await browser.$('dt=Statutory deadline for decision').isDisplayed());
    assert.ok(
      await browser.$(`dl*=${newDeadline}`).isDisplayed(),
      `Expected the new deadline of ${newDeadline} to be displayed`
    );
    assert.ok(await browser.$('summary=Application not complete and correct').isDisplayed());
  });

  it('Once all declarations are completed, a deadline extension can be submitted', async () => {
    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();

    let task = await findTask(browser, '[title="Testing deadline extension"]');
    await task.$('a=PPL application').click();

    await browser.$('label=Return with comments').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea[name=comment]').setValue('Returning to Bruce to make ready');
    await browser.$('button=Return with comments').click();

    await browser.withUser('holc');

    task = await findTask(browser, '[title="Testing deadline extension"]');
    await task.$('a=PPL application').click();

    await browser.$('label=Edit and resubmit the application').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea[name=comment]').setValue('Submitting as ready');
    await browser.$('button=Submit PPL application to Home Office').click();

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();

    task = await findTask(browser, '[title="Testing deadline extension"]');
    await task.$('a=PPL application').click();

    assert.ok(
      await browser.$('.task-status .deadline').$('dt=Deadline for decision'),
      'There should be a statutory deadline'
    );
    assert.ok(
      await browser.$('.task-status .deadline').$(`dd=${originalDeadline}`),
      'The statutory deadline date should be displayed'
    );

    await browser.$('//summary[text()="Extend deadline"]').doubleClick();
    await browser.$('//a[contains(.,"Extend deadline")]').click();

    assert.ok(
      await browser.$('h1=Extend statutory deadline').isDisplayed(),
      'the deadline extension confirm page should be displayed'
    );
    await browser.$('textarea[name=comment]').setValue('Extending deadline');
    await browser.$('button=Extend deadline').click();

    assert.ok(
      await browser.$('.task-status .deadline').$('dt=Extended deadline for decision'),
      'There should be an extended statutory deadline'
    );
    assert.ok(
      await browser.$('.task-status .deadline').$(`dd=${extendedDeadline}`),
      'The extended statutory deadline date should be displayed'
    );
    assert.ok(
      !(await browser.$('summary=Extend deadline').isDisplayed()),
      'no deadline extension option should be displayed'
    );

    const latestActivity = await browser.$$('.activity-log .log-item')[0];
    const latestActivityText = await latestActivity.getText();
    assert.equal(
      await latestActivity.$('.date').getText(),
      todayAsString,
      'the date of the deadline extension should be displayed'
    );
    assert.ok(
      latestActivityText.includes('Deadline for decision extended by: Inspector Morse'),
      'the name of the extender should be displayed in the activity log'
    );
    assert.ok(
      latestActivityText.includes(`Deadline extended from: ${originalDeadline}`),
      `the original deadline (${originalDeadline}) should be displayed in the activity log`
    );
    assert.ok(
      latestActivityText.includes(`Deadline extended to: ${extendedDeadline}`),
      `the extended deadline (${extendedDeadline}) should be displayed in the activity log`
    );
  });
});
