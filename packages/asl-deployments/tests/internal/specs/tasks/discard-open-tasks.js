import assert from 'assert';
import { findTask } from '../../../helpers/task.js';
import { findInPagination } from '../../../helpers/common.js';

const AWAITING_GRANT_TASK_ID = '2b6425cd-6c04-4de1-9a34-acedc6d190e3'; // seeded by asl-workflow

const selector = `a[href*="/tasks/${AWAITING_GRANT_TASK_ID}"]`;

describe('ASRU discard tasks', () => {

  describe('Licensing officers', () => {

    before(async() => {
      await browser.withUser('licensing');
    });

    beforeEach(async() => {
      await browser.url('/');
      await browser.gotoOutstandingTasks();
    });

    it('does not have the option to discard an open task', async() => {
      const _task = await findTask(browser, selector);
      await _task.click();
      assert(!await browser.$('details.asru-discard-task').isDisplayed(), 'licensing should not see option to discard open task');
    });

  });

  describe('Inspectors', () => {

    before(async() => {
      await browser.withUser('inspector');
    });

    beforeEach(async() => {
      await browser.url('/');
    });

    it('does not have the option to discard an open task', async() => {
      await browser.$('a=In progress').click();
      await browser.$('table:not(.loading)').waitForExist();
      const _task = await findTask(browser, selector);
      await _task.click();
      assert(!await browser.$('details.asru-discard-task').isDisplayed(), 'inspectors should not see option to discard open task');
    });

  });

  describe('ASRU Admins', () => {

    before(async() => {
      await browser.withUser('asruadmin');
    });

    beforeEach(async() => {
      await browser.url('/');
    });

    it('has the option to discard in progress tasks', async() => {
      await browser.$('a=In progress').click();
      await browser.$('table:not(.loading)').waitForExist();
      const _task = await findTask(browser, selector);
      await _task.click();
      const summary = await browser.$('summary=Discard this task');
      await summary.doubleClick();
      assert(await browser.$('a=Discard task').isDisplayed(), 'asruadmin should see option to discard in progress task');
    });

    it('can discard an open task', async() => {
      await browser.$('a=In progress').click();
      await browser.$('table:not(.loading)').waitForExist();
      const _task = await findTask(browser, selector);
      await _task.click();
      const summary = await browser.$('summary=Discard this task');
      await summary.doubleClick();
      await browser.$('a=Discard task').click();
      await browser.$('textarea[name=comment]').setValue('Closing task without action');
      await browser.$('button=Discard amendment').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Add named person');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');

      await browser.url('/');
      await browser.$('a=Completed').click();

      await findInPagination(`//a[@href="/tasks/${AWAITING_GRANT_TASK_ID}"]`);

      // scoped xpath selection is buggy in webdriver, so need to get the link and then ancestor in one selector
      const statusBadge = await browser.$(`//a[@href="/tasks/${AWAITING_GRANT_TASK_ID}"]/ancestor::tr//*[@class="badge"]/span`).getText();
      assert.equal(statusBadge, 'DISCARDED', 'task has a status of discarded');
    });

    it('does not have the option to discard closed tasks', async() => {
      await browser.$('a=Completed').click();
      await browser.$('table:not(.loading)').waitForExist();
      const _task = await findTask(browser, selector);
      await _task.click();
      assert(!await browser.$('details.asru-discard-task').isDisplayed(), 'asruadmin should not see option to discard closed task');
    });

  });

});
