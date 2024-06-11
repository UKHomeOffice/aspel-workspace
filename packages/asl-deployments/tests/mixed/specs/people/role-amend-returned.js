import assert from 'assert';
import { findTask } from '../../../helpers/task.js';
import { gotoProfile } from '../../../public/helpers/profile.js';

describe('Return role amendment to applicant', () => {
  it('does not provide an edit and resubmit option', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Roger Dorsett');
    await browser.$('a=Add role').click();
    await browser.$('label*=SQP').click();
    await browser.$('button=Continue').click();
    await browser.$('input[name="declaration"]').click();
    await browser.$('button=Submit').click();
    await browser.waitForSuccess();

    const taskSelector = 'a=Add named person (SQP)';

    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, taskSelector))
      .$('..')
      .$(taskSelector)
      .click();

    await browser.$('label=Return amendment with comments').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea[name="comment"]').setValue('Reasons');
    await browser.$('button=Return amendment with comments').click();
    await browser.waitForSuccess();

    await browser.withUser('holc');

    await (await findTask(browser, taskSelector))
      .$('..')
      .$(taskSelector)
      .click();

    const nextSteps = await browser
      .$$('input[name="status"]')
      .map((opt) => opt.getValue());
    assert.ok(
      !nextSteps.includes('updated'),
      'edit and resubmit should not be an option'
    );
    assert.ok(
      await browser
        .$('label=Add remark and resubmit the amendment')
        .isDisplayed(),
      'the resubmit option should have a custom label'
    );
  });
});
