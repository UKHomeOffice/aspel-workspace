import assert from 'assert';
import {
  gotoProjectManagementPage,
  completeAwerb
} from '../../../public/helpers/project.js';

describe('Reviewing changes to POLEs', () => {
  const projectTitle = 'Test changes to POLEs';

  it('can submit amendments to the POLEs', async () => {
    await browser.withUser('holc');

    await gotoProjectManagementPage(browser, projectTitle);
    await browser.$('button=Amend licence').click();
    await browser.$('a=Places other than a licensed establishment (POLEs)').click();
    await browser.$('button=Continue').click();

    await browser.$('h2=Specify the details of each POLE that you will be using.')
      .waitForDisplayed();

    let element = await browser.$('h2=POLE 1').closest('.panel');
    assert(
      await element.$('p*=Windermere').isDisplayed(),
      'first pole is named Windermere'
    );

    element = await browser.$('h2=POLE 2').closest('.panel');
    assert(
      await element.$('p*=Conniston').isDisplayed(),
      'second pole is named Conniston'
    );

    await browser.$('p*=Conniston').$('a=Edit name').click();
    await browser.$('input[value="Conniston"]').waitForDisplayed();
    await browser.$('input[value="Conniston"]').setValue('Ullswater');
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    assert(
      await browser.$('h2=Please review your answers for:').isDisplayed(),
      'on review page'
    );
    assert(
      await browser.$('p=Ullswater').isDisplayed(),
      'new POLE name is displayed'
    );

    element = await browser.$('p=Ullswater').closest('.review');
    assert(
      await element.$('span.badge.changed').isDisplayed(),
      'pole name has a changed badge'
    );

    assert(
      !(await element.$('p=Conniston').isDisplayed()),
      'old POLE name is not displayed'
    );

    await browser.$('button=Continue').click();
    await browser.waitForSync();
    await browser.$('button=Continue').click();

    await browser.$('h1=Send amendment').waitForDisplayed();
    await completeAwerb(browser, true);
    await browser.$('textarea[name=comments]').setValue('Reason for the change');
    await browser.$('textarea[name=comment]').setValue('Comment');
    await browser.$('button*=Submit PPL amendment').click();
    assert.ok(await browser.$('.success=Submitted').isDisplayed());
  });

  it('can review and grant amendments to the POLEs', async () => {
    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();

    await browser.$(`[title="${projectTitle}"]`).$('a=PPL amendment').click();
    await browser.$('a=View latest submission').click();
    await browser.$('a=Places other than a licensed establishment (POLEs)').click();

    assert(await browser.$('h2=POLE 1').isDisplayed(), 'first pole is displayed');
    assert(await browser.$('h2=POLE 2').isDisplayed(), 'second pole is displayed');

    let element = await browser.$('h2=POLE 2').closest('.panel');

    assert(
      await element.$('p=Ullswater').isDisplayed(),
      'second pole is named Ullswater'
    );

    await browser.$('a=View all sections').click();
    await browser.$('a=Continue').click();

    await browser.$('label=Amend licence').click();
    await browser.$('button=Continue').click();

    await browser.completeHba();

    await browser.$('button=Amend licence').click();
    await browser.waitForSuccess();
  });
});
