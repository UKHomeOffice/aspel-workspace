import assert from 'assert';
import { findTask } from '../../../helpers/task.js';
import { gotoProfile } from '../../../public/helpers/profile.js';
import { gotoEstablishment } from '../../../public/helpers/establishment.js';

describe('Remove NVS', () => {
  it('unassigns places in the schedule of premises when removing an NVS role from a user with assigned places', async () => {
    await browser.withUser('holc');
    await gotoEstablishment(browser, 'University of Croydon');

    await browser.$('a=Approved areas').click();

    assert.ok(await browser.$('a=Kingsley Collins').isDisplayed());

    await gotoProfile(browser, 'Kingsley Collins');

    await browser.$('a=Remove role').click();
    await browser.$('button=Continue').click();
    await browser.$('input[name="declaration"]').click();
    await browser.$('button=Submit').click();
    await browser.waitForSuccess();

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await (await findTask(browser, 'td*=Kingsley Collins'))
      .$('a*=Remove named person')
      .click();
    await browser.$('input[name="status"][value="resolved"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Amend licence').click();
    await browser.waitForSuccess();

    await browser.withUser('holc');

    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();

    if (await browser.$('a=Kingsley Collins').isDisplayed()) {
      console.log('Found assigned places... waiting');
      await browser.pause(10000);
      await browser.refresh();
    }

    assert.ok(!(await browser.$('a=Kingsley Collins').isDisplayed()));
  });
});
