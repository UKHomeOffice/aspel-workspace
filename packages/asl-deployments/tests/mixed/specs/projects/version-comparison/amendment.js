import assert from 'assert';
import { gotoProjectManagementPage } from '../../../../public/helpers/project.js';
import { editAndSubmit, gotoTask, gotoEdit, returnToApplicant, endorse, assertComparison } from './helpers.js';

describe('version comparison - amendment', () => {
  it('shows all versions to holc but only submitted versions to inspector', async () => {
    const TITLE = 'Version comparison test amendment';

    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, TITLE);
    await browser.$('button=Amend licence').click();
    await editAndSubmit('First iteration', 'amendment');

    await browser.withUser('holc');
    await gotoTask(TITLE, 'amendment');
    await assertComparison('Granted version', 'First iteration');
    await returnToApplicant('Return amendment with comments');

    await browser.withUser('basic');
    await gotoTask(TITLE, 'amendment');
    await gotoEdit();
    await editAndSubmit('Second iteration', 'amendment');

    await browser.withUser('holc');
    await gotoTask(TITLE, 'amendment');
    await assertComparison(['Granted version', 'First iteration'], 'Second iteration');
    await endorse('amendment');

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await gotoTask(TITLE, 'amendment');
    await assertComparison('Granted version', 'Second iteration');
    await returnToApplicant('Return amendment with comments');

    await browser.withUser('basic');
    await gotoTask(TITLE, 'amendment');
    await gotoEdit();
    await editAndSubmit('Third iteration', 'amendment');

    await browser.withUser('holc');
    await gotoTask(TITLE, 'amendment');
    await assertComparison(['Granted version', 'Second iteration'], 'Third iteration');
    await endorse('amendment');

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await gotoTask(TITLE, 'amendment');
    await assertComparison(['Granted version', 'Second iteration'], 'Third iteration');
    await returnToApplicant('Return amendment with comments');

    await browser.withUser('basic');
    await gotoTask(TITLE, 'amendment');
    await gotoEdit();
    await editAndSubmit('Fourth iteration', 'amendment');

    await browser.withUser('holc');
    await gotoTask(TITLE, 'amendment');
    await assertComparison(['Granted version', 'Third iteration'], 'Fourth iteration');
    await endorse('amendment');

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await gotoTask(TITLE, 'amendment');
    await assertComparison(['Granted version', 'Third iteration'], 'Fourth iteration');
    await returnToApplicant('Return amendment with comments');
  });

  it('shows POLE title when new POLE added (regression)', async () => {
    const TITLE = 'Version comparison test amendment';

    await browser.withUser('basic');
    await gotoTask(TITLE, 'amendment');
    await browser.$('label=Edit and resubmit the amendment').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Places other than a licensed establishment (POLEs)').click();
    await browser.$('label=Yes').click();
    await browser.$('button=Continue').click();
    await browser.$('input[name*="title"]').setValue('POLE title');

    await browser.waitForSync();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    if (await browser.$('textarea[name="comments"]').isExisting()) {
      await browser.$('textarea[name="comments"]').setValue('Reason for the change');
    }

    await browser.$(`button*=Submit PPL amendment`).click();
    await browser.waitForSuccess();

    await browser.withUser('holc');
    await gotoTask(TITLE, 'amendment');
    await browser.$('a=View latest submission').click();

    await browser.$('a=Places other than a licensed establishment (POLEs)').click();

    const badge = await browser.$('.panel .review .badge.changed');
    assert.ok(badge.isDisplayed());
    assert.equal(await badge.getText(), 'CHANGED');

    await browser.$('.panel').$("a=See what's changed").click();

    await browser.$('.diff-window .before').$('p=No answer provided').waitForDisplayed();
    assert.ok(await browser.$('.diff-window .before').$('p=No answer provided').isDisplayed());
    assert.ok(await browser.$('.diff-window .after').$('p=POLE title').isDisplayed());
  });
});
