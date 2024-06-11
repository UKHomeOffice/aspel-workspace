import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

const RA_NEGATIVE = 'p=The Secretary of State has determined that a retrospective assessment of this licence is not required.';
const RA_POSITIVE = 'p=The Secretary of State has determined that a retrospective assessment of this licence is required, and should be submitted within 6 months of the licence\'s revocation date.';

describe('Adding conditions', () => {
  before(async () => {
    await browser.withUser('inspector');
  });
  afterEach(async () => {
    await browser.waitForSync();
  });

  it('can add additional conditions to a submitted project with a reminder', async () => {
    await gotoProjectLandingPage(browser, 'Amend in prog project');

    await browser.$('.tasklist').$('a=PPL amendment').click();
    await browser.$('a=View latest submission').click();

    await browser.$('h2=Additional conditions and authorisations').waitForDisplayed();
    await browser.$('a=Additional conditions').click();

    await browser.$('button=Add more additional conditions').waitForDisplayed();
    await browser.$('button=Add more additional conditions').click();
    await browser.$('label[for*=regtox]').$('h3=Regulatory toxicology').waitForDisplayed();
    await browser.$('label[for*=regtox]').$('h3=Regulatory toxicology').click();
    await browser.$('label[for*=regtox]').$('a=Edit').waitForDisplayed();
    await browser.$('label[for*=regtox]').$('a=Edit').click();

    await browser.$('textarea').setValue('Custom content for regtox');
    const checkBox = await browser.$('label=Set a reminder for deadlines associated with this condition');
    await checkBox.waitForClickable();
    await checkBox.click();
    await browser.$('label[for*=deadline-day]').nextElement().setValue('01');
    await browser.$('label[for*=deadline-month]').nextElement().setValue('01');
    await browser.$('label[for*=deadline-year]').nextElement().setValue('2023');
    await browser.$('button=Save').click();
    await browser.$('button=Confirm').click();

    await browser.waitUntil(async () => browser.$('p=Custom content for regtox').isDisplayed(), 10000);
    const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
    await summary.waitForClickable();
    await summary.click();
    await browser.waitUntil(async () => browser.$('li=01/01/2023').isDisplayed(), 10000);

    await browser.$('button=Remove').click();
    await browser.acceptAlert();

    assert.ok(!await browser.$('p=Custom content for regtox').isDisplayed());
  });

  it('can add a retrospective assessment condition', async () => {
    await gotoProjectLandingPage(browser, 'Amend in prog project');

    await browser.$('.tasklist').$('a=PPL amendment').click();
    await browser.$('a=View latest submission').click();
    await browser.$('a=Additional conditions').click();

    assert.ok(browser.$(RA_NEGATIVE).isDisplayed(), 'RA condition negative statement should be displayed');

    await browser.$('.retrospective-assessment').$('button=Change').click();
    await browser.$('.retrospective-assessment').$('input[value="true"]').click();
    await browser.$('.retrospective-assessment').$('button=Save').click();

    assert.ok(!await browser.$(RA_NEGATIVE).isDisplayed(), 'RA condition negative statement should not be displayed');

    assert.ok(browser.$(RA_POSITIVE).isDisplayed(), 'RA condition positive statement should be displayed');
  });

  it('can add a custom condition with a reminder', async () => {
    await gotoProjectLandingPage(browser, 'Amend in prog project');

    await browser.$('.tasklist').$('a=PPL amendment').click();
    await browser.$('a=View latest submission').click();

    await browser.$('h2=Additional conditions and authorisations').waitForDisplayed();
    await browser.$('a=Additional conditions').click();

    await browser.$('button=Add more additional conditions').waitForDisplayed();
    await browser.$('button=Add more additional conditions').click();

    await browser.$('input[name="conditions"][value="custom"]').click();
    await browser.$('textarea[name="content"]').setValue('Custom condition content');
    await browser.$('label=Set a reminder for deadlines associated with this condition').click();
    await browser.$('label[for*=deadline-day]').nextElement().setValue('01');
    await browser.$('label[for*=deadline-month]').nextElement().setValue('01');
    await browser.$('label[for*=deadline-year]').nextElement().setValue('2023');
    await browser.$('button=Save').click();
    await browser.$('button=Confirm').waitForClickable();
    await browser.$('button=Confirm').click();

    const text = await (await browser.$$('.condition').pop()).$('.condition-text').getText();
    const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
    await summary.waitForClickable();
    await summary.click();
    const reminderDate = await browser.$('.condition-reminders').$('li').getText();
    assert.equal(text, 'Custom condition content');
    assert.equal(reminderDate, '01/01/2023');
  });

});
