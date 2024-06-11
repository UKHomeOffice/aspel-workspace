import assert from 'assert';
import {
  gotoProjectManagementPage,
  gotoProjectList,
  gotoProjectLandingPage,
  completeAwerb
} from '../../../public/helpers/project.js';

const submitTransfer = async () => {
  await browser.$('button=Amend licence').click();
  await browser.$('a=Establishments').click();

  await browser.$('label=Small Pharma').click();
  await browser.$('input[name="other-establishments"][value="true"]').click();
  await browser.$('button=Continue').click();

  await browser.$('label=University of Croydon').click();

  await browser.$('button=Continue').click();
  await browser.$('button=Continue').click();
  await browser.$('button=Continue').click();

  await browser.$('a=Transfer and movement of animals').click();
  await browser.$('button=Continue').click();
  await browser.$('label=This section is complete').click();
  await browser.$('button=Continue').click();

  await browser.$('a=Experience').click();
  await browser.$('button=Continue').click();
  await browser.$('label=This section is complete').click();
  await browser.$('button=Continue').click();

  await browser.$('a=Protocols').click();
  await browser.$('.control-panel').$('button=Continue').click();
  await browser.$('label=This section is complete').click();
  await browser.$('button=Continue').click();
  await browser.waitForSync();

  await browser.$('button=Continue').click();
  await browser.$('textarea[name="comment"]').setValue('some comments');
  await browser.$('textarea[name="comments"]').setValue('some comments');
  await browser.$('button*=Submit PPL amendment').click();
  await browser.waitForSuccess();
};

const endorseTransfer = async (title) => {
  await browser.withUser('holc');
  await browser.$(`[title="${title}"]`).$('a=PPL transfer').click();
  await browser.$('label=Endorse transfer request').click();
  await browser.$('button=Continue').click();
  await completeAwerb(browser, true); // outgoing establishment can be exempt from AWERB
  await browser.$('button=Endorse transfer request').click();
  await browser.waitForSuccess();

  // endorse again at receiving establishment
  await browser.url('/');
  await browser.$(`[title="${title}"]`).$('a=PPL transfer').click();
  assert.ok(
    await browser.$('p=Reason for no review:').isDisplayed(),
    'outgoing establishment declared themselves exempt from AWERB'
  );
  assert.ok(
    await browser.$('p=AWERB Not required').isDisplayed(),
    'exempt from AWERB text should be displayed'
  );

  await browser.$('label=Endorse transfer request').click();
  await browser.$('button=Continue').click();
  assert.ok(
    await browser.$('h2*=AWERB review at Small Pharma').isDisplayed(),
    'AWERB for receiving establishment should be required'
  );
  assert.ok(
    await browser.$('h2*=AWERB review at University of Croydon').isDisplayed(),
    'AWERB for AA establishments should be required'
  );
  await completeAwerb(browser);
  await browser.$('button=Endorse transfer request').click();
  await browser.waitForSuccess();
};

const grantTransfer = async (title) => {
  await browser.withUser('inspector');
  await browser.gotoOutstandingTasks();
  await browser.$(`[title="${title}"]`).$('a=PPL transfer').click();
  await browser.$('label=Approve transfer').click();
  await browser.$('button=Continue').click();

  await browser.completeHba();

  await browser.$('button=Approve transfer').click();
  await browser.waitForSuccess();
};

describe('Additional availability', () => {
  describe('Granted licence', () => {
    const title = 'Additional availability to transfer';
    let taskUrl;

    it('can submit a transfer to swap the primary and additional establishment', async () => {
      await browser.withUser('additionalavailability');
      await gotoProjectManagementPage(browser, title);

      await submitTransfer();
      await endorseTransfer(title);

      await browser.$('a=track the progress of this request.').click();
      taskUrl = await browser.getUrl();

      assert.ok(
        await browser
          .$('.activity-log')
          .$('dt=Small Pharma AWERB review date:'),
        'receiving establishment AWERB review date should be displayed'
      );
      assert.ok(
        await browser
          .$('.activity-log')
          .$('dt=University of Croydon AWERB review date:'),
        'AA establishment AWERB review date should be displayed'
      );
      assert.ok(
        !(await browser.$('dd=Invalid Date').isDisplayed()),
        'there should be no invalid AWERB dates'
      );
      assert.ok(
        !(await browser
          .$('#submitted-version')
          .$('p=AWERB Not required')
          .isDisplayed()),
        'the latest submission section should not contain the AWERB exemption'
      );

      await grantTransfer(title);

      await browser.withUser('additionalavailability');

      await gotoProjectList(browser, 'University of Croydon');
      assert.ok(
        await (await browser.$(`a=${title}`).closest('td'))
          .$('li=Primary availability at Small Pharma')
          .isDisplayed()
      );

      await gotoProjectList(browser, 'Small Pharma');
      assert.ok(
        await (await browser.$(`a=${title}`).closest('td'))
          .$('li=Additional availability at University of Croydon')
          .isDisplayed()
      );
    });

    it('does not show reporting tab on transferred project landing page', async () => {
      await browser.withUser('holc');
      await gotoProjectLandingPage(
        browser,
        title,
        'Inactive',
        'University of Croydon'
      );

      assert.ok(!(await browser.$('a=Reporting').isDisplayed()));
    });

    describe('Project licence links in the resolved task', () => {
      it('croydon only admin', async () => {
        await browser.withUser('spareholc');
        await browser.url(taskUrl);
        await browser.$('a=View granted licence').click();
        assert(
          await browser
            .$('.govuk-breadcrumbs')
            .$('a=University of Croydon')
            .isDisplayed(),
          'the granted licence link should be the transferred version at the outgoing establishment'
        );
        assert(
          await browser.$('.licence-status-banner.transferred').isDisplayed(),
          'the licence should display a transferred banner'
        );
      });

      it('admin at both establishments', async () => {
        await browser.withUser('holc');
        await browser.url(taskUrl);
        await browser.$('a=View granted licence').click();
        assert(
          await browser
            .$('.govuk-breadcrumbs')
            .$('a=Small Pharma')
            .isDisplayed(),
          'the granted licence link should be the licence at the new establishment'
        );
        assert(
          !(await browser.$('.licence-status-banner').isDisplayed()),
          'there should be no licence status banner'
        );

        await browser.url(taskUrl);
        await browser.$('summary=Show previous activity').click();
        await browser.$('.version-links').waitForDisplayed();
        await browser.$('a*=View this version').click();
        assert(
          await browser
            .$('.govuk-breadcrumbs')
            .$('a=University of Croydon')
            .isDisplayed(),
          'the endorsed version link should be the transferred version at the outgoing establishment'
        );
        assert(
          await browser.$('.licence-status-banner.transferred').isDisplayed(),
          'the endorsed version should display a transferred banner'
        );
      });

      it('licence holder', async () => {
        await browser.withUser('additionalavailability');
        await browser.url(taskUrl);
        await browser.$('a=View granted licence').click();
        assert(
          await browser
            .$('.govuk-breadcrumbs')
            .$('a=Small Pharma')
            .isDisplayed(),
          'the granted licence link should be the licence at the new establishment'
        );
        assert(
          !(await browser.$('.licence-status-banner').isDisplayed()),
          'there should be no licence status banner'
        );

        await browser.url(taskUrl);
        await browser.$('summary=Show previous activity').click();
        await browser.$('.version-links').waitForDisplayed();
        await browser.$('a*=View this version').click();
        assert(
          await browser
            .$('.govuk-breadcrumbs')
            .$('a=University of Croydon')
            .isDisplayed(),
          'the endorsed version link should be the transferred version at the outgoing establishment'
        );
        assert(
          await browser.$('.licence-status-banner.transferred').isDisplayed(),
          'the endorsed version should display a transferred banner'
        );
      });

      it('ASRU user', async () => {
        await browser.withUser('asruadmin');
        await browser.url(taskUrl);
        await browser.$('a=View granted licence').click();
        assert(
          await browser
            .$('.govuk-breadcrumbs')
            .$('a=Small Pharma')
            .isDisplayed(),
          'the granted licence link should be the licence at the new establishment'
        );
        assert(
          !(await browser.$('.licence-status-banner').isDisplayed()),
          'there should be no licence status banner'
        );

        await browser.url(taskUrl);
        await browser.$('summary=Show previous activity').click();
        await browser.$('.version-links').waitForDisplayed();
        await browser.$('a*=View this version').click();
        assert(
          await browser
            .$('.govuk-breadcrumbs')
            .$('a=University of Croydon')
            .isDisplayed(),
          'the endorsed version link should be the transferred version at the outgoing establishment'
        );
        assert(
          await browser.$('.licence-status-banner.transferred').isDisplayed(),
          'the endorsed version should display a transferred banner'
        );
      });
    });
  });
});
