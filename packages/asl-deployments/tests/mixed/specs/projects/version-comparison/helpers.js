import assert from 'assert';
import { completeAwerb } from '../../../../public/helpers/project.js';

const editAndSubmit = async (value, type = 'application') => {
  await browser.$('a=Aims').click();
  if (await browser.$('.nts').$('button=Continue').isDisplayed()) {
    await browser.$('.nts').$('button=Continue').click();
  }
  const text = await browser.$('[name="project-aim"]').getText();
  await browser
    .$('[name="project-aim"]')
    .completeRichText(Array(text.length).fill('Backspace'));
  await browser.waitForSync();

  await browser.$('[name="project-aim"]').completeRichText(value);
  await browser.waitForSync();
  await browser.$('button=Continue').click(); // complete step
  await browser.$('button=Continue').click(); // complete section
  await browser.$('button=Continue').click(); // complete application

  if (await browser.$('input[name="ready"]').isExisting()) {
    await browser.$('input[name="ready"][value="true"]').click();
  }

  if (await browser.$('textarea[name="comments"]').isExisting()) {
    await browser
      .$('textarea[name="comments"]')
      .setValue('Reason for the change');
  }

  await browser.$(`button=Submit PPL ${type}`).click();
  await browser.waitForSuccess();
};

const gotoTask = async (title, type = 'application') => {
  await browser.url('/');
  await browser.gotoOutstandingTasks();
  await browser.$(`[title="${title}"]`).$(`a=PPL ${type}`).click();
};

const gotoEdit = async () => {
  await browser.$('input[name="status"][value="updated"]').click();
  await browser.$('button=Continue').click();
};

const returnToApplicant = async (buttonText = 'Return with comments') => {
  await browser
    .$('input[name="status"][value="returned-to-applicant"]')
    .click();
  await browser.$('button=Continue').click();
  await browser.$('textarea[name="comment"]').setValue('Reasons');
  await browser.$(`button=${buttonText}`).click();

  await browser.waitForSuccess();
};

const endorse = async (type = 'application') => {
  await browser.$('input[name="status"][value="endorsed"]').click();
  await browser.$('button=Continue').click();

  await completeAwerb(browser, true);

  if (await browser.$('input[name="ready"]').isExisting()) {
    await browser.$('input[name="ready"][value="true"]').click();
  }

  await browser.$(`button=Endorse ${type}`).click();

  await browser.waitForSuccess();
};

const assertNoChanges = async () => {
  await browser.$('a=View latest submission').click();
  assert.ok(!(await browser.$('.badge.changed').isExisting()));
  await browser.$('a=Aims').click();
  assert.ok(!(await browser.$('.badge.changed').isExisting()));
  assert.ok(!(await browser.$("a=See what's changed").isExisting()));

  await browser.$('a=View all sections').click();
  await browser.$('a=Continue').click();
};

const assertComparison = async (before, after) => {
  if (!Array.isArray(before)) {
    before = [before];
  }
  await browser.$('a=View latest submission').click();
  await browser.$('a=Aims').click();

  const badge = await browser.$('.review .badge.changed');
  assert.ok(badge.isDisplayed());
  assert.equal(await badge.getText(), 'CHANGED');

  await browser.$("a=See what's changed").click();

  await browser
    .$('.diff-window .before')
    .$('p=Loading...')
    .waitForDisplayed({ reverse: true });

  assert.ok(
    await browser.$('.diff-window .before').$(`p=${before[0]}`).isDisplayed()
  );
  assert.ok(
    await browser.$('.diff-window .after').$(`p=${after}`).isDisplayed()
  );

  if (before.length > 1) {
    await browser.$('.diff-window .govuk-tabs li:nth-child(2) a').click();
    await browser
      .$('.diff-window .before')
      .$('p=Loading...')
      .waitForDisplayed({ reverse: true });

    assert.ok(
      await browser.$('.diff-window .before').$(`p=${before[1]}`).isDisplayed()
    );
    await browser.$('a=Close').click();
  } else {
    assert.ok(!(await browser.$('.diff-window .govuk-tabs').isDisplayed()));
    await browser.$('a=Close').click();
  }

  await browser.$('a=View all sections').click();
  await browser.$('a=Continue').click();
};

export {
  editAndSubmit,
  gotoTask,
  gotoEdit,
  returnToApplicant,
  endorse,
  assertNoChanges,
  assertComparison
};
