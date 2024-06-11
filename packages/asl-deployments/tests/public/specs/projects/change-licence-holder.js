import assert from 'assert';
import { gotoProjectManagementPage } from '../../../public/helpers/project.js';

describe('Change of project licence holder', () => {

  // regression test for confirmation pages throwing a 404 error when
  // changing to a collaborator not normally visible to the PPL holder
  it('basic user can submit a change of licence holder to a collaborator', async() => {
    const title = 'Change licence holder collaborator';

    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, title);
    await browser.$('a=change licence holder only').click();

    await browser.$('#licenceHolderId').setValue('dagny');
    await browser.$('li*=Dagny').waitForDisplayed();
    await browser.$('li*=Dagny').click();

    await browser.$('[name="comments"]').setValue('Changing to Dagny');
    await browser.$('button=Continue').click();
    await browser.$('button=Submit PPL amendment').click();

    assert.ok(await browser.$('h1=Submitted').isDisplayed());
  });

});
