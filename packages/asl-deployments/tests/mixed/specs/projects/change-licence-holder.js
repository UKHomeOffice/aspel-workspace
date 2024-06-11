import assert from 'assert';
import {
  gotoProjectLandingPage,
  gotoProjectManagementPage,
  gotoManageTab,
  gotoHistoryTab,
  completeAwerb
} from '../../../public/helpers/project.js';

describe('Change of project licence holder', () => {
  it('can submit a change which goes to holc to endorse', async () => {
    const title = 'Change licence holder';

    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, title);
    await browser.$('a=change licence holder only').click();

    await browser.$('#licenceHolderId').setValue('megan');
    await browser.$('li*=Megan').waitForDisplayed();
    await browser.$('li*=Megan').click();

    await browser.$('[name="comments"]').setValue('Changing to Megan');
    await browser.$('button=Continue').click();
    await browser.$('button=Submit PPL amendment').click();

    assert.ok(await browser.$('h1=Submitted').isDisplayed());

    await browser.withUser('holc');

    await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();

    await browser.$('label=Endorse amendment').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="awerb-exempt"][value="false"]').click();
    await browser.$('input[name*="day"]').setValue('01');
    await browser.$('input[name*="month"]').setValue('01');
    await browser.$('input[name*="year"]').setValue('2021');

    await browser.$('[name="comment"]').setValue('This is fine');

    assert.ok(
      await browser
        .$("li=Megan Alberts's training record is accurate and up to date.")
        .isDisplayed()
    );

    await browser.$('button=Endorse amendment').click();
    assert.ok(await browser.$('h1=Endorsed').isDisplayed());

    await browser.$('a=View task').click();
    assert.ok(
      await browser
        .$("li=Megan Alberts's training record is accurate and up to date.")
        .isDisplayed()
    );

    await browser.$('label=Recall amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Recall amendment').click();

    assert.ok(await browser.$('h1=Recalled').isDisplayed());

    await browser.$('a=View task').click();
    await browser.$('label=Edit and resubmit the amendment').click();
    await browser.$('button=Continue').click();

    await browser.$('#licenceHolderId').click();
    await browser.keys('Back space');

    await browser.$('#licenceHolderId').setValue('dagny');
    await browser.$('li*=Dagny').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    assert.ok(
      await browser
        .$("li=Dagny Aberkirder's training record is accurate and up to date.")
        .isDisplayed()
    );
    await browser.$('button=Submit PPL amendment to Home Office').click();

    assert.ok(await browser.$('h1=Submitted').isDisplayed());
    await browser.$('a=View task').click();

    assert.ok(
      await browser
        .$("li=Dagny Aberkirder's training record is accurate and up to date.")
        .isDisplayed()
    );

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();

    await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();

    await browser.$('input[name="status"][value="resolved"]').click();
    await browser.$('button=Continue').click();

    await browser.completeHba();
    await browser.$('button=Amend licence').click();

    assert.equal(
      await browser.$('h1.govuk-panel__title').getText(),
      'Licence amended'
    );
  });

  it('can re-assign an unsubmitted draft project', async () => {
    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, 'Unsubmitted draft', 'Drafts');
    await browser.$('a=Change licence holder').click();

    await browser.$('#licenceHolderId').setValue('dagny');
    await browser.$('li*=Dagny').waitForDisplayed();
    await browser.$('li*=Dagny').click();

    await browser
      .$('[name="experience-knowledge"]')
      .completeRichText('Dagny is super good');

    await browser.$('button=Continue').click();

    assert.ok(await browser.$('dd*=Dagny Aberkirder').isDisplayed());
    assert.ok(await browser.$('p=Dagny is super good').isDisplayed());

    await browser.$('button=Submit').click();

    await browser.waitForSuccess();

    await gotoProjectLandingPage(browser, 'Unsubmitted draft', 'Drafts');
    assert.ok(await browser.$('dd*=Dagny Aberkirder').isDisplayed());
  });

  it('updates the experience fields in the draft application', async () => {
    await browser.withUser('holc');
    await gotoProjectLandingPage(browser, 'Unsubmitted draft', 'Drafts');

    await browser.$('a=Open application').click();
    await browser.$('a=Experience').click();
    assert.ok(await browser.$('p=Dagny is super good').isDisplayed());
  });

  it('shows the previous teaching experience question and reveal on confirm page for a training ppl - BUGFIX', async () => {
    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, 'Training licence');
    await browser.$('a=change licence holder only').click();

    await browser.$('#licenceHolderId').setValue('dagny');
    await browser.$('li*=Dagny').waitForDisplayed();
    await browser.$('li*=Dagny').click();

    await browser
      .$('input[name="training-has-delivered"][value="true"]')
      .click();
    await browser
      .$('[name="training-delivery-experience"]')
      .completeRichText('Dagny has done training');

    await browser.$('button=Continue').click();

    assert.ok(await browser.$('dd*=Dagny Aberkirder').isDisplayed());
    const container = await browser
      .$(
        'h3=Has this person previously delivered courses that required a higher education and training licence?'
      )
      .closest('.review');
    assert.ok(await container.$('p=Yes').isDisplayed());
    assert.ok(await browser.$('p=Dagny has done training').isDisplayed());
  });

  describe('Active project', () => {
    const projectTitle = 'Test change licence holder';
    const originalLicenceHolder = 'Basic User';
    const newLicenceHolder = 'Also Basic';

    let projectUrl = '';

    it('Original readonly licence holder can access the project', async () => {
      await browser.withUser('basic');
      await gotoProjectLandingPage(browser, projectTitle);
      projectUrl = await browser.getUrl();
      assert.ok(
        await browser.$(`h2=${projectTitle}`).isDisplayed(),
        `${originalLicenceHolder} can access the project`
      );
    });

    it('New readonly licence holder cannot access the project', async () => {
      await browser.withUser('basic2');
      await browser.url(projectUrl);
      assert.deepStrictEqual(
        await browser.$('h1').getText(),
        'Page not found',
        `${newLicenceHolder} cannot access the project`
      );
    });

    it('Can submit a request to change licence holder', async () => {
      await browser.withUser('holc');
      await gotoProjectLandingPage(browser, projectTitle);

      assert.ok(
        await browser.$('.licence-details').$(`dd=${originalLicenceHolder}`),
        `licence holder is ${originalLicenceHolder}`
      );

      await gotoManageTab(browser);
      await browser.$('a*=change licence holder').click();

      await browser.$('#licenceHolderId').setValue(newLicenceHolder);
      await browser.$('li*=Also').waitForDisplayed();
      await browser.$('li*=Also').click();

      await browser.$('button=Continue').click();

      assert.ok(await browser.$(`dd*=${newLicenceHolder}`).isDisplayed());

      await browser.$('button=Continue').click();

      await completeAwerb(browser);

      await browser.$('button=Submit PPL amendment to Home Office').click();
    });

    it('Can approve a request to change licence holder', async () => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$(`[title="${projectTitle}"]`).$('a=PPL amendment').click();

      await browser.$('input[name="status"][value="resolved"]').click();
      await browser.$('button=Continue').click();

      await browser.completeHba();
      await browser.$('button=Amend licence').click();
      assert.equal(
        await browser.$('h1.govuk-panel__title').getText(),
        'Licence amended'
      );
    });

    it('Has the correct licence holder for the current active licence', async () => {
      await browser.withUser('holc');
      await gotoProjectLandingPage(browser, projectTitle);

      assert.ok(
        await browser.$('.licence-details').$(`dd=${newLicenceHolder}`),
        `landing page licence holder is ${newLicenceHolder}`
      );

      await browser.$('a=View licence').click();
      assert.deepStrictEqual(
        await browser.$('p.licence-holder').getText(),
        newLicenceHolder,
        `current licence view licence holder is ${newLicenceHolder}`
      );

      const pdf = await browser.downloadFile('pdf');
      assert.ok(
        await pdf.includes(newLicenceHolder),
        `current licence pdf licence holder is ${newLicenceHolder}`
      );
    });

    it('Has the correct licence holder for the superseeded version of the licence', async () => {
      await browser.withUser('holc');
      await gotoProjectLandingPage(browser, projectTitle);
      await gotoHistoryTab(browser);

      await browser.$('a*=View the licence granted on').click();
      assert.deepStrictEqual(
        await browser.$('.licence-status-banner .status').getText(),
        'SUPERSEDED',
        'licence has superseded banner'
      );
      assert.deepStrictEqual(
        await browser.$('p.licence-holder').getText(),
        originalLicenceHolder,
        `historical licence view licence holder is ${originalLicenceHolder}`
      );

      const pdf = await browser.downloadFile('pdf');
      assert.ok(
        await pdf.includes(originalLicenceHolder),
        `historical licence pdf licence holder is ${originalLicenceHolder}`
      );
    });

    it('New readonly licence holder can access the project', async () => {
      await browser.withUser('basic2');
      await browser.url(projectUrl);
      assert.ok(
        await browser.$(`h2=${projectTitle}`).isDisplayed(),
        `${newLicenceHolder} can access the project`
      );
    });

    it('Original readonly licence holder can no-longer access the project', async () => {
      await browser.withUser('basic');
      await browser.url(projectUrl);
      assert.deepStrictEqual(
        await browser.$('h1').getText(),
        'Page not found',
        `${originalLicenceHolder} can no-longer access the project`
      );
    });
  });
});
