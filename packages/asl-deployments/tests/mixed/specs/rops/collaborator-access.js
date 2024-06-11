import assert from 'assert';
import { gotoProjectLandingPage } from '../../../public/helpers/project.js';
import { gotoProjectLandingPage as gotoProjectLandingPageAsInternal } from '../../../internal/helpers/project.js';

describe('Collaborator rops', () => {
  it('Can resume a started ROP as collaborator', async () => {
    await browser.withUser('inspector');
    await gotoProjectLandingPageAsInternal(browser, 'ROP collaborator test');
    await browser.$('li=Reporting').click();
    await browser.$('button*=Start return').click();

    await browser.withUser('collabedit');
    await gotoProjectLandingPage(browser, 'ROP collaborator test');
    assert.ok(
      await browser.$('li=Reporting').isDisplayed(),
      'Reporting tab should be shown'
    );

    await browser.$('li=Reporting').click();
    await browser.$('a=Continue return for 2021').click();

    await browser.$('button=Continue return set up').click();

    await browser.$('label*=Yes').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=Yes').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=In the UK').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('label=Basic research').click();
    await browser.$('button=Continue').click();

    await browser.$('label=Oncology').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('label*=No').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue to procedures').click();

    await browser.$('a=Add procedures').click();
    await browser.$('label=Sub-threshold').click();
    await browser.$('input[name="sub-severityNum"]').waitForExist();
    await browser.$('input[name="sub-severityNum"]').setValue('123');

    await browser.$('button=Add procedures').click();

    assert.ok(
      await browser
        .$(
          'p=Only the PPL holder or an admin can submit this to the Home Office.'
        )
        .isDisplayed()
    );
    assert.ok(!(await browser.$('a=Submit return').isDisplayed()));
  });

  it('cannot access rop as a basic collab', async () => {
    await browser.withUser('collabread');
    await gotoProjectLandingPage(browser, 'ROP collaborator test');
    assert.ok(
      !(await browser.$('li=Reporting').isDisplayed()),
      'Reporting tab should not be shown'
    );
  });
});
