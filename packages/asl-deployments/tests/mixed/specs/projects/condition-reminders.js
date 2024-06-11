import assert from 'assert';
import { gotoProjectLandingPage, submitApplication } from '../../../public/helpers/project.js';
import { gotoProjectLandingPage as gotoProjectLandingPageInternal } from '../../../internal/helpers/project.js';
import { findTask } from '../../../helpers/task.js';

describe('Condition reminders', () => {
  const projectTitle = 'Condition reminders';

  before(async () => {
    await browser.withUser('holc');
    await gotoProjectLandingPage(browser, projectTitle, 'Drafts');
    await browser.$('a=Open application').click();
    await submitApplication(browser, 'Submitting for conditions test');
    await browser.waitForSuccess();
  });

  describe('adding reminders to existing project conditions', () => {
    it('can add a condition and save it', async () => {
      await browser.withUser('inspector');
      await browser.$('a=Outstanding').click();
      const task = await findTask(browser, `[title="${projectTitle}"]`);
      await task.$('a').click();
      await browser.$('a=View latest submission').click();

      await browser.$('a=Additional conditions').click();
      await browser.$('button=Add more additional conditions').click();
      await browser.$('label[for*=inspection]').$('h3=Inspection requirement').click();
      await browser.$('button=Confirm').click();
      await browser.waitForSync();

      assert.ok(await browser.$('.conditions .inspection').$('h3=Inspection requirement').isDisplayed());
    });

    it('can add a reminder to the previously saved condition', async () => {
      await browser.$('.conditions .inspection').$('button=Edit').doubleClick();
      await browser.$('label=Set a reminder for deadlines associated with this condition').click();
      await browser.$('label[for*=deadline-day]').nextElement().setValue('01');
      await browser.$('label[for*=deadline-month]').nextElement().setValue('01');
      await browser.$('label[for*=deadline-year]').nextElement().setValue('2028');

      await browser.$('button=Save').click();
      await browser.waitForSync();

      const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary.waitForClickable();
      await summary.click();
      assert.ok(await browser.$('li=01/01/2028').isDisplayed());
    });

    it('can add a second reminder to the previously saved condition', async () => {
      await browser.$('.conditions .inspection').$('button=Edit').doubleClick();
      await browser.$('button=Add another deadline').click();

      const deadline2Fieldset = await browser.$(
        '//label[.="Condition deadline 2"]/ancestor::*[@class="gutter"]//fieldset'
      );
      await deadline2Fieldset.$('label[for*=deadline-day]').nextElement().setValue('02');
      await deadline2Fieldset.$('label[for*=deadline-month]').nextElement().setValue('01');
      await deadline2Fieldset.$('label[for*=deadline-year]').nextElement().setValue('2028');

      await browser.$('button=Save').click();
      await browser.waitForSync();

      const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary.waitForClickable();
      await summary.click();
      assert.ok(await browser.$('li=01/01/2028').isDisplayed());
      assert.ok(await browser.$('li=02/01/2028').isDisplayed());
    });
  });

  describe('adding project conditions and reminders at the same time', () => {
    it('can add a new condition with a new reminder without saving the condition first', async () => {
      await browser.$('button=Add more additional conditions').click();
      await browser.$('label[for*=reporting]').$('h3=Reporting requirement').click();
      await browser.$('label[for*=reporting]').$('a=Edit').click();

      await browser.$('textarea').setValue('Custom content for reporting');
      await browser.$('//label[.="Set a reminder for deadlines associated with this condition"]').click();
      await browser.$('label[for*=deadline-day]').nextElement().setValue('03');
      await browser.$('label[for*=deadline-month]').nextElement().setValue('01');
      await browser.$('label[for*=deadline-year]').nextElement().setValue('2028');
      await browser.$('button=Save').click();
      await browser.$('button=Confirm').click();
      await browser.waitForSync();

      const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary.waitForClickable();
      await summary.click();
      assert.ok(await browser.$('li=03/01/2028').isDisplayed());
    });
  });

  describe('adding protocol conditions and reminders', () => {
    it('can add a protocol condition reminder', async () => {
      await browser.$('a=View all sections').click();
      await browser.$('a=Protocols').click();
      await browser.$('h2*=First protocol').click();
      await browser.$('h3*=Protocol 1: Additional conditions').click();
      await browser.$('button=Add additional condition').click();
      await browser.$('textarea').setValue('Condition added to protocol 1');
      await browser.$('button=Save').click();
      await browser.waitForSync();

      assert.ok(await browser.$('p=Condition added to protocol 1').isDisplayed());

      await browser.$('.conditions').$('button=Edit').click();
      await browser.$('label=Set a reminder for deadlines associated with this condition').click();
      await browser.$('label[for*=deadline-day]').nextElement().setValue('04');
      await browser.$('label[for*=deadline-month]').nextElement().setValue('01');
      await browser.$('label[for*=deadline-year]').nextElement().setValue('2028');
      await browser.$('button=Save').click();
      await browser.waitForSync();

      const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary.waitForClickable();
      await summary.click();
      assert.ok(await browser.$('li=04/01/2028').isDisplayed());
    });

    it('can add a second reminder to the protocol condition', async () => {
      await browser.$('.conditions').$('button=Edit').doubleClick();
      await browser.$('button=Add another deadline').click();

      const deadline2Fieldset = await browser.$(
        '//label[contains(.,"Condition deadline 2")]/ancestor::div[@class="gutter"]//fieldset'
      );
      await deadline2Fieldset.$('label[for*=deadline-day]').nextElement().setValue('05');
      await deadline2Fieldset.$('label[for*=deadline-month]').nextElement().setValue('01');
      await deadline2Fieldset.$('label[for*=deadline-year]').nextElement().setValue('2028');

      await browser.$('button=Save').click();
      await browser.waitForSync();

      const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary.waitForClickable();
      await summary.click();
      assert.ok(await browser.$('li=04/01/2028').isDisplayed());
      assert.ok(await browser.$('li=05/01/2028').isDisplayed());
    });

    it('can add condition reminders to more than one protocol', async () => {
      await browser.$('//section[div/div/h2//text()="1: First protocol"]//div//div[@class="header"]').click(); // close first protocol
      await browser.$('h2*=Second protocol').click();
      await browser.$('h3*=Protocol 2: Additional conditions').click();
      await browser.$('button=Add additional condition').click();
      await browser.$('textarea').setValue('Condition added to protocol 2');
      await browser.$('button=Save').click();
      await browser.waitForSync();

      assert.ok(await browser.$('p=Condition added to protocol 2').isDisplayed());

      await browser.$('.conditions').$('button=Edit').click();
      await browser.$('label=Set a reminder for deadlines associated with this condition').click();
      await browser.$('label[for*=deadline-day]').nextElement().setValue('06');
      await browser.$('label[for*=deadline-month]').nextElement().setValue('01');
      await browser.$('label[for*=deadline-year]').nextElement().setValue('2028');
      await browser.$('button=Save').click();
      await browser.waitForSync();

      const summary = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary.waitForClickable();
      await summary.click();
      assert.ok(await browser.$('li=06/01/2028').isDisplayed());
    });
  });

  describe('removing reminders before the licence is granted', () => {
    it('can remove a project condition reminder', async () => {
      await browser.$('a=View all sections').click();
      await browser.$('a=Additional conditions').click();

      await browser.$('.conditions .inspection').$('button=Edit').click();
      await browser.$('//label[.="Condition deadline 2"]/ancestor::*[@class="gutter"]//a[.="Remove"]').click();

      await browser.$('button=Save').click();
      await browser.waitForSync();

      await browser.$('summary=Show when reminders have been scheduled').click();
      assert.ok(await browser.$('li=01/01/2028').isDisplayed());
      assert.ok(!(await browser.$('li=02/01/2028').isDisplayed()));
    });

    it('can remove a protocol condition reminder', async () => {
      await browser.$('a=View all sections').click();
      await browser.$('a=Protocols').click();
      await browser.$('h2*=First protocol').click();
      await browser.$('h3*=Protocol 1: Additional conditions').click();

      await browser.$('.conditions').$('button=Edit').click();
      await browser
        .$('//label[contains(.,"Condition deadline 1")]/ancestor::div[@class="gutter"]//a[text()="Remove"]')
        .click();
      await browser.$('button=Save').click();
      await browser.waitForSync();

      await browser.$('summary=Show when reminders have been scheduled').click();
      assert.ok(!(await browser.$('li=04/01/2028').isDisplayed()));
      assert.ok(await browser.$('li=05/01/2028').isDisplayed());
    });
  });

  describe('conditions and their reminders are visible on the granted licence', () => {
    it('can grant a licence with condition reminders', async () => {
      await browser.$('a=View all sections').click();
      await browser.$('a=Continue').click();
      await browser.$('label=Grant licence').click();
      await browser.$('button=Continue').click();

      await browser.completeHba();

      await browser.$('button=Grant licence').click();

      assert.ok(await browser.$('.success=Approved').isDisplayed());
    });

    it('displays the correct reminders on the granted licence', async () => {
      await gotoProjectLandingPageInternal(browser, projectTitle);
      await browser.$('a=View licence').click();
      await browser.$('.sidebar-nav').$('h3=Conditions').click();

      await browser.$('.conditions .inspection').$('summary=Show when reminders have been scheduled').click();
      assert.ok(await browser.$('li=01/01/2028').isDisplayed());
      assert.ok(!(await browser.$('li=02/01/2028').isDisplayed()));

      const summary1 = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary1.waitForClickable();
      await summary1.click();
      assert.ok(await browser.$('li=03/01/2028').isDisplayed());

      await browser.$('.sidebar-nav').$('h3=Protocols').click();
      await browser.$('h2*=First protocol').click();
      await browser.$('h3*=Protocol 1: Additional conditions').click();
      assert.ok(await browser.$('p=Condition added to protocol 1').isDisplayed());
      await browser.$('.conditions').$('summary=Show when reminders have been scheduled').click();
      assert.ok(!(await browser.$('li=04/01/2028').isDisplayed()));
      assert.ok(await browser.$('li=05/01/2028').isDisplayed());

      await browser.$('//section[div/div/h2//text()="1: First protocol"]//div//div[@class="header"]').click(); // close first protocol
      await browser.$('h2*=Second protocol').click();
      await browser.$('h3*=Protocol 2: Additional conditions').click();
      const summary2 = await browser.$('//summary[text()="Show when reminders have been scheduled"]');
      await summary2.waitForClickable();
      await summary2.click();
      assert.ok(await browser.$('li=06/01/2028').isDisplayed());
    });
  });
});
