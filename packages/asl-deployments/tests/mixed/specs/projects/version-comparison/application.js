import { gotoDraft } from '../../../../public/helpers/project.js';

import {
  editAndSubmit,
  gotoTask,
  gotoEdit,
  returnToApplicant,
  endorse,
  assertNoChanges,
  assertComparison
} from './helpers.js';

describe('version comparison - application', () => {
  it('shows all versions to holc but only submitted versions to inspector', async () => {
    const TITLE = 'Version comparison test application';

    await browser.withUser('basic');
    await gotoDraft(browser, TITLE);
    await editAndSubmit('First iteration');

    await browser.withUser('holc');
    await gotoTask(TITLE);
    await assertNoChanges();
    await returnToApplicant();

    await browser.withUser('basic');
    await gotoTask(TITLE);
    await gotoEdit();
    await editAndSubmit('Second iteration');

    await browser.withUser('holc');
    await gotoTask(TITLE);
    await assertComparison('First iteration', 'Second iteration');
    await endorse();

    await browser.withUser('inspector');
    await gotoTask(TITLE);
    await assertNoChanges();
    await returnToApplicant();

    await browser.withUser('basic');
    await gotoTask(TITLE);
    await gotoEdit();
    await editAndSubmit('Third iteration');

    await browser.withUser('holc');
    await gotoTask(TITLE);
    await assertComparison(
      ['First iteration', 'Second iteration'],
      'Third iteration'
    );
    await endorse();

    await browser.withUser('inspector');
    await gotoTask(TITLE);
    await assertComparison('Second iteration', 'Third iteration');
    await returnToApplicant();

    await browser.withUser('basic');
    await gotoTask(TITLE);
    await gotoEdit();
    await editAndSubmit('Fourth iteration');

    await browser.withUser('holc');
    await gotoTask(TITLE);
    await assertComparison(
      ['First iteration', 'Third iteration'],
      'Fourth iteration'
    );
    await endorse();

    await browser.withUser('inspector');
    await gotoTask(TITLE);
    await assertComparison(
      ['Second iteration', 'Third iteration'],
      'Fourth iteration'
    );
  });
});
