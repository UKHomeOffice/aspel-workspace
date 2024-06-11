import assert from 'assert';
import { completeAwerb, gotoProjectLandingPage } from '../../helpers/project.js';
import { findTask } from '../../../helpers/task.js';

async function clearErrorBanner() {
  if (await browser.$('.alert.alert-error').isDisplayed()) {
    await browser.$('.alert.alert-error').click();
    await browser.waitUntil(
      async () => !(await browser.$('.alert.alert-error').isDisplayed()),
      { timeout: 10000 }
    );
  }
}

describe('Reusable steps', () => {
  const projectTitle = 'Reusable steps';
  const EDITING_THIS_STEP_WARNING =
    "You are editing only this instance of this step. Changes made to this step will not appear where the 'Protocol 1 Step 1 - Reusable Reference' step is reused on protocols 3 and 4.";
  const EDITING_ALL_INSTANCES_WARNING =
    'You are editing all instances of this step. The changes will also appear in protocols 3 and 4.';

  const addProtocol = async (protocolTitle, protocolNumber) => {
    const protocols = await browser.$$('.protocol');
    if (protocols.length < protocolNumber) {
      await browser.$$('button=Add another protocol')[1].click();
    }
    await browser.$('.protocol.panel input[type="text"]').setValue(protocolTitle);
    // When text is entered an additional button is added to the DOM, moving the click target, so we need to wait for
    // it to appear...
    await browser.waitUntil(
      async () => (await browser.$$('button=Add another protocol')).length === 2
    );

    await browser.$('.protocol.panel').$('button=Continue').click();
    await browser.$(`h2*=${protocolTitle}`)
      .waitForDisplayed({timeoutMsg: `${protocolTitle} not created`});

    await browser.$(`h3=Protocol ${protocolNumber}: Steps`).doubleClick();
    return browser.$$('.protocol')[protocolNumber - 1];
  };

  const addStep = async (protocol, protocolNumber, stepNumber, text, reusable, optional) => {
    await expandStepsSection(protocolNumber);
    const steps = await protocol.$$('.step');
    if (steps.length < stepNumber) {
      await protocol.$('button=Add another step').click();
    }

    if (await protocol.$('h2=Add step').isDisplayed()) {
      await protocol.$('input[type=radio][name*=add-stepaddExisting][value=false]').click();
      await protocol.$(`h3=Step ${stepNumber}`).waitForDisplayed();
    }
    const step = await protocol.$(`h3=Step ${stepNumber}`).closest('.step');
    await step.$('[name*="title"]').waitForDisplayed();
    await step.$('[name*="title"]').completeRichText(text);
    await step.$('input[type="text"][name*=reference]').setValue(`${text} Reference`);
    await step.$(`input[type=radio][name*=optional][value=${optional}]`).click();
    await step.$(`input[type=radio][name*=reusable][value=${reusable}]`).click();

    await step.$('button=Save step').click();
  };

  const expandStep = async (stepTitle) => {
    const stepHiddenContentXPath = `//h3[text()="${stepTitle}"]/following::div[contains(@class,"content") and contains(@class,"hidden")][1]`;
    const stepHiddenContent = await browser.$(stepHiddenContentXPath);
    if (await stepHiddenContent.isExisting()) {
      await browser.$(`//h3[text()="${stepTitle}"]/preceding-sibling::p/button`).click();
    }
  };

  const expandStepsSection = async (protocolNumber) => {
    const sectionHiddenContentXPath = `//header[h3//text()="Protocol ${protocolNumber}: Steps"]/following-sibling::div[contains(@class,"content") and contains(@class,"hidden")]`;
    const sectionHiddenContent = await browser.$(sectionHiddenContentXPath);
    if (await sectionHiddenContent.isExisting()) {
      await browser.$(`//section[header/h3//text()="Protocol ${protocolNumber}: Steps"]`).click();
    }
  };

  const expandProtocol = async (protocolName) => {
    const protocolHiddenContentXPath = `//div[h2//text()="${protocolName}"]/following-sibling::div[contains(@class,"content") and contains(@class,"hidden")]`;
    const protocolHiddenContent = await browser.$(protocolHiddenContentXPath);
    if (await protocolHiddenContent.isExisting()) {
      await browser.$(`//section[div/div/h2/text()="${protocolName}"]`).click();
    }
  };

  const ensureChangeBadgesShownOnReview = async (protocol, protocolNumber) => {
    assert.ok(await protocol.$('.changed').isDisplayed(), `Change badge not displayed on protocol`);
    await protocol.$('h2').click();

    const stepsExpandable = await protocol.$(`h3*=Protocol ${protocolNumber}: Steps`).closest('.expandable');
    assert.ok(await stepsExpandable.$('.changed'), `Change badge not displayed on steps`);

    await protocol.$(`h3*=Protocol ${protocolNumber}: Steps`).click();
    await protocol.$('h3*=Protocol 1 Step 2 - Reusable Reference').click();

    const step = await protocol.$(
      '//p[contains(.,"Protocol 1 Step 2 - Reusable Reference")]/ancestor::section[@class="review-step"]'
    );
    const changedClass = await step.$$('.changed');
    assert.ok(changedClass.length === 2, 'should show 2 changed badges, one for the step and one for the field');
  };

  const ensureChangeBadgesShownOnAmendment = async (protocol, protocolNumber) => {
    assert.ok(await protocol.$('.changed').isDisplayed(), `Change badge not displayed on protocol`);
    await protocol.$('h2').click();

    const stepsExpandable = await protocol.$(`h3*=Protocol ${protocolNumber}: Steps`).closest('.expandable');
    assert.ok(await stepsExpandable.$('.changed'), `Change badge not displayed on steps`);
    await protocol.$(`h3*=Protocol ${protocolNumber}: Steps`).click();
    await protocol.$(`a*=Open all steps`).click();

    const step = await protocol.$(
      '//h3[contains(.,"Protocol 1 Step 2 - Reusable Reference")]/ancestor::section[@class="review-step"]'
    );
    const changedClass = await step.$$('.changed');
    assert.ok(changedClass.length === 2, 'should show 2 changed badges, one for the step and one for the field');
  };

  it('can create steps for re-use', async () => {
    await browser.withUser('holc');
    await browser.url('/');
    await gotoProjectLandingPage(browser, projectTitle, 'Drafts');
    await browser.$('a=Open application').click();

    // Add mice to project for protocols
    await browser.$('a=Introductory details').click();
    await browser.$('summary=Small animals').click();
    await browser.$('input[name="SA"][value="mice"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Protocols').click();
    await browser.$('h1=Protocols').waitForExist();

    const addExistingSteps = async (protocol, protocolNumber, stepNumber, stepsToAdd) => {
      await expandStepsSection(protocolNumber);
      if ((await protocol.$$('.step').length) < stepNumber) {
        await protocol.$('button=Add another step').click();
      }
      if (await protocol.$('h2=Add step').isDisplayed()) {
        await protocol.$('input[type=radio][name*=add-stepaddExisting][value=true]').click();
        await protocol.$('h2=Select step').waitForDisplayed();
      }
      for (const stepToAdd of stepsToAdd) {
        await browser.$(`label=${stepToAdd} Reference`).click();
      }
      await browser.$('button=Add steps to protocol').click();
    };

    const firstProtocol = await addProtocol('First protocol', 1);
    await firstProtocol.$('h3=Protocol 1: Animals used in this protocol').click();
    await firstProtocol.$('label=Mice').click();
    await firstProtocol.$('label=Embryo and egg').click();

    await addStep(firstProtocol, 1, 1, 'Protocol 1 Step 1 - Reusable', true, false);
    await addStep(firstProtocol, 1, 2, 'Protocol 1 Step 2 - Reusable', true, true);
    await addStep(firstProtocol, 1, 3, 'Protocol 1 Step 3 - Not Reusable', false, true);
    await firstProtocol.$('input[type=checkbox][name=complete][value=true]').click();
    await firstProtocol.$('button=Continue').click();

    const secondProtocol = await addProtocol('Second protocol', 2);
    await addStep(secondProtocol, 2, 1, 'Protocol 2 Step 1 - Reusable', true, false);
    await secondProtocol.$('input[type=checkbox][name=complete][value=true]').click();
    await secondProtocol.$('button=Continue').click();

    const thirdProtocol = await addProtocol('Third protocol', 3);
    await addExistingSteps(thirdProtocol, 3, 1, [
      'Protocol 1 Step 1 - Reusable',
      'Protocol 1 Step 2 - Reusable',
      'Protocol 2 Step 1 - Reusable'
    ]);
    await thirdProtocol.$('input[type=checkbox][name=complete][value=true]').click();
    await thirdProtocol.$('button=Continue').click();

    const fourthProtocol = await addProtocol('Fourth protocol', 4);
    await addExistingSteps(fourthProtocol, 4, 1, ['Protocol 1 Step 1 - Reusable', 'Protocol 1 Step 2 - Reusable']);
    await addStep(fourthProtocol, 4, 3, 'Protocol 4 Step 2 - Not Reusable', false, true);

    await fourthProtocol.$('input[type=checkbox][name=complete][value=true]').click();
    await fourthProtocol.$('button=Continue').click();

    assert.ok((await browser.$$('section.protocol').length) === 4, 'Could not find 4 protocols');
  });

  it('can edit this step', async () => {
    await expandProtocol('1: First protocol');
    await browser.$('h3=Protocol 1: Steps').click();

    const step = await browser.$('h3*=Step 1').closest('.step');

    await step.$('a=Edit just this step').click();
    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.ok(warningText.includes(EDITING_THIS_STEP_WARNING), 'there should be an editing this step warning');

    // Cancel a change
    await step.$('[name*="title"]').completeRichText(' Edit just this step content to be removed when cancelled');
    await step.$('button=Cancel').click();

    // Confirm change reverted
    await step.$('#title.readonly').waitForDisplayed();
    assert.equal(await step.$('#title.readonly').getText(), 'Protocol 1 Step 1 - Reusable');

    // Make change
    await step.$('a=Edit just this step').click();
    await step.$('[name*="title"]').completeRichText(' Edit just this step content to be changed when saved');
    await step.$('button=Save step').click();

    // Confirm change made
    const titleText = await step.$('#title').getText();
    assert.ok(
      titleText.includes('Edit just this step content to be changed when saved'),
      'the title text should have been updated'
    );
  });

  it('can edit every instance of this step', async () => {
    const step = await browser.$('h3*=Step 2').closest('.step');

    await step.$('a=Edit every instance of this step').click();

    const warningText = await browser.$('.govuk-warning-text__text').getText();
    assert.equal(warningText, EDITING_ALL_INSTANCES_WARNING);

    // Cancel a change
    await step.$('[name*="title"]').completeRichText(' Edit every instance Content to be removed when cancelled');
    await step.$('button=Cancel').click();

    // Confirm change reverted
    await step.$('#title.readonly').waitForDisplayed();
    assert.equal(await step.$('#title.readonly').getText(), 'Protocol 1 Step 2 - Reusable');

    // Make change
    await step.$('a=Edit every instance of this step').click();
    await step.$('[name*="title"]').completeRichText(' Edit every instance content to be changed when saved');
    await step.$('button=Save step').click();

    // Confirm change made
    const titleText = await step.$('#title').getText();
    assert.ok(
      titleText.includes('Edit every instance content to be changed when saved'),
      'the title text should have been updated'
    );

    await browser.$('//*[@id="complete"]/following::button[1]').click();
  });

  it('displays the step information correctly on the review', async () => {
    await browser.$('//a[text()="List of sections"]/preceding-sibling::button[text()="Continue"]').click();
    await expandProtocol('1: First protocol');

    await browser.$('h3=Protocol 1: Steps').click();
    await expandStep('Protocol 1 Step 1 - Reusable Reference (edited)');
    const firstExpandable = await browser
      .$('//p[text()="Protocol 1 Step 1 - Reusable Reference (edited)"]//preceding::div[@id="title"][1]')
      .getText();

    assert.equal(
      await firstExpandable,
      'Protocol 1 Step 1 - Reusable Edit just this step content to be changed when saved'
    );

    await browser.$('h2=2: Second protocol').click();
    await browser.$('h3=Protocol 2: Steps').click();
    await expandStep('Protocol 2 Step 1 - Reusable Reference');
    const secondExpandable = await browser
      .$('//p[text()="Protocol 2 Step 1 - Reusable Reference"]//preceding::div[@id="title"][1]')
      .getText();

    assert.equal(secondExpandable, 'Protocol 2 Step 1 - Reusable');
  });

  it('displays the step information correctly on the granted licence', async () => {
    await browser.$('button=Continue').click();

    await browser.$('h2=Submit application').waitForDisplayed();
    await browser.$('button=Continue').click();
    await browser.waitForSync();
    await browser.$('h1=Send application').waitForDisplayed();

    await completeAwerb(browser);
    await browser.$('button=Submit PPL application to Home Office').click();
    await browser.waitForSuccess();

    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    const task = await findTask(browser, `[title="${projectTitle}"]`);
    await task.$('..').$('a=PPL application').click();

    await browser.$('label=Grant licence').click();
    await browser.$('button=Continue').click();

    await browser.completeHba();

    await browser.$('button=Grant licence').click();
    await browser.waitForSuccess();

    await browser.withUser('holc');
    await gotoProjectLandingPage(browser, projectTitle);
    await browser.$('a=View licence').click();
    await browser.$('h3=Protocols').click();
    await browser.$('h2=1: First protocol').click();
    await browser.$('h3=Protocol 1: Steps').click();
    const firstStep = await browser.$('.granted-step');
    assert.equal(
      await firstStep.$('.step-number').getText(),
      'Step 1 : Protocol 1 Step 1 - Reusable Reference (edited) (Mandatory)'
    );
    assert.equal(
      await firstStep.$('#title').getText(),
      'Protocol 1 Step 1 - Reusable Edit just this step content to be changed when saved'
    );

    await browser.$('h2=3: Third protocol').click();
    await browser.$('h3=Protocol 3: Steps').click();

    const thirdProtocolSteps = await browser.$(
      '//h2[text()="3: Third protocol"]/following::*[contains(@class,"steps")][1]'
    );
    const firstStepThirdProtocol = await thirdProtocolSteps.$('.granted-step');
    assert.equal(
      await firstStepThirdProtocol.$('.step-number').getText(),
      'Step 1 : Protocol 1 Step 1 - Reusable Reference (Mandatory)'
    );
    assert.equal(await firstStepThirdProtocol.$('#title').getText(), 'Protocol 1 Step 1 - Reusable');
  });

  it('displays the step information correctly on the summary table', async () => {
    if (await browser.$('//a[text()="Back to top"]').isDisplayed()) {
      await browser.$('//a[text()="Back to top"]').click();
      await browser.waitForSync();
    }
    await browser.$('//a[contains(text(),"View summary table")]').click();

    // protocol summary opens in a new window
    await browser.switchWindow(/protocol-summary/);

    await browser.$('tbody tr.expandable').click();
    assert.ok(await browser.$('h3=Step 2 (optional)').isDisplayed());
    assert.ok(
      await browser
        .$('p=Protocol 1 Step 2 - Reusable Edit every instance content to be changed when saved')
        .isDisplayed()
    );

    await browser.$('//button[.="Close summary table"]').scrollIntoView({ block: 'center' });
    await browser.$('//button[.="Close summary table"]').click();
    await browser.switchWindow(/protocols/);
  });

  it('displays changes on all protocols a step is re-used', async () => {
    await browser.withUser('holc');
    await browser.url('/');
    await gotoProjectLandingPage(browser, projectTitle);

    await browser.$('a=Manage licence').click();

    await browser.$('button=Amend licence').click();

    await browser.$('a=Protocols').click();
    await browser.$('h1=Protocols').waitForExist();

    await browser.$('h2=1: First protocol').click();
    await browser.$('h3=Protocol 1: Steps').click();

    const step = await browser.$('h3*=Step 2').closest('.step');
    await step.$('a=Edit every instance of this step').click();

    await step.$('[name*="title"]').completeRichText(' A change added to an amendment');
    await step.$('button=Save step').click();

    assert.ok(await step.$('.changed'), `Change badge not displayed`);
    await step.$(`a=See what's changed`).click();

    await browser.waitUntil(
      async () =>
        browser
          .$('.diff-window .before')
          .$('p=Protocol 1 Step 2 - Reusable Edit every instance content to be changed when saved')
          .isDisplayed(),
      { timeout: 10_000 }
    );
    await browser.waitUntil(
      async () =>
        browser
          .$('.diff-window .after')
          .$(
            'p=Protocol 1 Step 2 - Reusable Edit every instance content to be changed when saved A change added to an amendment'
          )
          .isDisplayed(),
      { timeout: 10_000 }
    );

    await clearErrorBanner();

    await browser.$('a=Close').click();
  });

  it('displays changes on review screen', async () => {
    // Ensure the re-used step change is reflected on the review page
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('h2=Please review your answers for:').waitForDisplayed();
    const protocols = await browser.$$('.protocol');

    await ensureChangeBadgesShownOnReview(protocols[0], 1);
    await ensureChangeBadgesShownOnReview(protocols[2], 3);
    await ensureChangeBadgesShownOnReview(protocols[3], 4);
  });

  it('shows changed on application amendment once submitted', async () => {
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.waitForSync();
    await browser.$('h1=Send amendment').waitForDisplayed();

    await completeAwerb(browser);
    await browser.$('textarea[name="comments"]').setValue('To check changed badges');

    await browser.$('button=Submit PPL amendment to Home Office').click();
    await browser.waitForSuccess();

    // Login as inspector, view task, Ensure the protocols and appropriate steps are marked changed

    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('..').$('a=PPL amendment').click();

    await browser.$('a=View latest submission').click();
    await browser.$('a=Protocols').click();

    const protocolsSideNav = await browser.$('h3=Protocols');
    const closestPanel = await protocolsSideNav.closest('.expanding-panel');
    assert.ok(
      await closestPanel
        .$('//header//span[contains(concat(" ",normalize-space(@class)," ")," changed ")]')
        .isExisting(),
      'changed badge should appear on header'
    );
    assert.ok(
      await closestPanel
        .$(
          '//*[contains(concat(" ",normalize-space(@class)," ")," content ")]//span[contains(concat(" ",normalize-space(@class)," ")," changed ")]'
        )
        .isExisting(),
      'changed badge should appear on content'
    );

    const protocols = await browser.$$('.protocol');
    await ensureChangeBadgesShownOnAmendment(protocols[0], 1);
    await ensureChangeBadgesShownOnAmendment(protocols[2], 3);
    await ensureChangeBadgesShownOnAmendment(protocols[3], 4);
  });
});
