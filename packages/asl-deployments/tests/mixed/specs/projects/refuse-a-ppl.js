import assert from 'assert';
import { findTask } from '../../../helpers/task.js';
import { gotoProjectLandingPage, gotoProjectManagementPage, completeAwerb } from '../../../public/helpers/project.js';
import { gotoProjectLandingPage as gotoProjectLandingPageInternal } from '../../../internal/helpers/project.js';

describe('Refuse a PPL', () => {
  it('refuse flow should not be an option for amendments', async () => {
    const projectTitle = 'Refuse PPL: amendments should not be refusable';
    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, projectTitle);
    await browser.$('button=Amend licence').click();
    await browser.$('button=Continue').click();
    await completeAwerb(browser, true);
    await browser.$('textarea[name="comments"]').setValue('Reason for amendment');
    await browser.$('button*=Submit PPL amendment').click();
    await browser.waitForSuccess();

    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    const nextSteps = await browser.$$('input[name="status"]').map((opt) => opt.getValue());
    assert.ok(!(await nextSteps.includes('intention-to-refuse')), 'intention to refuse should not be an option');
    assert.ok(!(await nextSteps.includes('refused')), 'refused should not be an option');
  });

  it('inspector can notify applicant of intention to refuse', async () => {
    const projectTitle = 'Refuse PPL: submitted';
    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    await browser.$('input[name="status"][value="intention-to-refuse"]').click();
    await browser.$('button=Continue').click();

    // expand the notice preview
    await browser.$('summary*=Show where the reason appears').click();
    assert.ok(await browser.$('p=Dear Basic User').isDisplayed());
    assert.ok(await browser.$('h3=NOTICE OF INTENTION TO REFUSE A LICENCE UNDER ASPA 1986').isDisplayed());
    assert.ok(await browser.$('p=Application title: Refuse PPL: submitted').isDisplayed());
    assert.ok(await browser.$('p=Inspector Morse').isDisplayed());

    // add a reason
    await browser
      .$('textarea[name="comment"]')
      .setValue('This is my reason, there are many like it but this one is mine');
    assert.ok(
      await browser
        .$('.refusal-reason')
        .$('p=This is my reason, there are many like it but this one is mine')
        .isDisplayed()
    );
    await browser.$('button=Give reason for refusal').click();

    // review the reason
    assert.ok(await browser.$('h1=Check notice of intention to refuse').isDisplayed());
    assert.ok(
      await browser
        .$('.refusal-reason')
        .$('p=This is my reason, there are many like it but this one is mine')
        .isDisplayed()
    );

    // change the reason
    await browser.$('a=Edit').click();
    await browser.$('textarea[name="comment"]').setValue('This is my reason.');
    await browser.$('button=Give reason for refusal').click();

    // review again and submit
    assert.ok(await browser.$('.refusal-reason').$('p=This is my reason.').isDisplayed());
    await browser.$('button=Send now').click();
    await browser.waitForSuccess();

    assert.ok(await browser.$('p*=the notice of intention to refuse has been sent').isDisplayed());
  });

  it('inspector can notify applicant of intention to refuse when task has no licenceHolder stored in database', async () => {
    const projectTitle = 'Refuse PPL: submitted - No licenceHolder on task';
    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    await browser.$('input[name="status"][value="intention-to-refuse"]').click();
    await browser.$('button=Continue').click();

    // expand the notice preview
    await browser.$('summary*=Show where the reason appears').click();
    assert.ok(await browser.$('p=Dear Basic User').isDisplayed());
    assert.ok(await browser.$('h3=NOTICE OF INTENTION TO REFUSE A LICENCE UNDER ASPA 1986').isDisplayed());
    assert.ok(await browser.$('p=Application title: Refuse PPL: submitted - No licenceHolder on task').isDisplayed());
    assert.ok(await browser.$('p=Inspector Morse').isDisplayed());

    // add a reason
    await browser
      .$('textarea[name="comment"]')
      .setValue('This is my reason, there are many like it but this one is mine');
    assert.ok(
      await browser
        .$('.refusal-reason')
        .$('p=This is my reason, there are many like it but this one is mine')
        .isDisplayed()
    );
    await browser.$('button=Give reason for refusal').click();

    // review the reason and submit
    assert.ok(await browser.$('h1=Check notice of intention to refuse').isDisplayed());
    assert.ok(
      await browser
        .$('.refusal-reason')
        .$('p=This is my reason, there are many like it but this one is mine')
        .isDisplayed()
    );
    await browser.$('button=Send now').click();
    await browser.waitForSuccess();

    assert.ok(await browser.$('p*=the notice of intention to refuse has been sent').isDisplayed());
  });

  it('intention to refuse reason should be visible on the task activity', async () => {
    const projectTitle = 'Refuse PPL: submitted';
    await browser.withUser('holc');
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    assert.ok(await browser.$('span*=The Home Office are planning to refuse this application').isDisplayed());
    assert.ok(await browser.$('span*=Notice of intention to refuse issued').isDisplayed());
    assert.ok(await browser.$('h3=NOTICE OF INTENTION TO REFUSE A LICENCE UNDER ASPA 1986').isDisplayed());
    assert.ok(await browser.$('p=This is my reason.').isDisplayed());
  });

  it('applicant can edit and resubmit but intention to refuse notice should persist', async () => {
    const projectTitle = 'Refuse PPL: can resubmit';
    await browser.withUser('holc');
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    assert.ok(await browser.$('span*=The Home Office are planning to refuse this application').isDisplayed());
    await browser.$('input[name="status"][value="updated"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await completeAwerb(browser);
    await browser.$('button=Submit PPL application to Home Office').click();
    await browser.waitForSuccess();

    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();
    assert.ok(await browser.$('span*=The Home Office are planning to refuse this application').isDisplayed());
  });

  it('inspector cannot refuse a ppl with refuse deadline in the future when with the applicant', async () => {
    const projectTitle = 'Refuse PPL: deadline future with applicant';
    await browser.withUser('inspector');
    await browser.$('a=In progress').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    assert.ok(await browser.$('span*=The Home Office are planning to refuse this application').isDisplayed());
    assert.ok(!(await browser.$('input[name="status"][value="refused"]').isDisplayed()));
  });

  it('inspector cannot refuse a ppl with refuse deadline in the future when with asru', async () => {
    const projectTitle = 'Refuse PPL: deadline future with asru';
    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    assert.ok(await browser.$('span*=The Home Office are planning to refuse this application').isDisplayed());
    assert.ok(!(await browser.$('input[name="status"][value="refused"]').isDisplayed()));
  });

  it('inspector can refuse a ppl once refuse deadline has passed when with applicant', async () => {
    const projectTitle = 'Refuse PPL: deadline passed with applicant';
    await browser.withUser('inspector');
    await browser.$('a=In progress').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    assert.ok(
      await browser
        .$(
          'span=The 28 day deadline for responding to the intention to refuse notice has passed. If the applicant has not responded you should refuse the licence.'
        )
        .isDisplayed()
    );
    await browser.$('button=Refuse licence').click();
    await browser.$('button=Refuse licence').click();
    await browser.waitForSuccess();
    assert.ok(await browser.$('h1=Refused').isDisplayed());

    await gotoProjectLandingPageInternal(browser, projectTitle);
    await browser.$('.licence-status-banner').$('a=Show more').click();
    assert.ok(await browser.$('.licence-status-banner.red .status').$('span=Refused').isDisplayed());
    assert.ok(await browser.$('.licence-status-banner.red').$('span*=This licence is not active.').isDisplayed());
    assert.ok(await browser.$('a=View submitted draft').isDisplayed());
  });

  it('inspector can refuse a ppl once refuse deadline has passed when with asru', async () => {
    const projectTitle = 'Refuse PPL: deadline passed with asru';
    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await (await findTask(browser, `[title="${projectTitle}"]`)).$('a').click();

    assert.ok(
      await browser
        .$(
          'span=The 28 day deadline for responding to the intention to refuse notice has passed. If the applicant has not responded you should refuse the licence.'
        )
        .isDisplayed()
    );
    await browser.$('input[name="status"][value="refused"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Refuse licence').click();
    await browser.waitForSuccess();
    assert.ok(await browser.$('h1=Refused').isDisplayed());

    await gotoProjectLandingPageInternal(browser, projectTitle);
    await browser.$('.licence-status-banner').$('a=Show more').click();
    assert.ok(await browser.$('.licence-status-banner.red .status').$('span=Refused').isDisplayed());
    assert.ok(await browser.$('.licence-status-banner.red').$('span*=This licence is not active.').isDisplayed());
    assert.ok(await browser.$('a=View submitted draft').isDisplayed());
  });

  it('refused banner is visible to external users', async () => {
    const projectTitle = 'Refuse PPL: refused';
    await browser.withUser('holc');
    await gotoProjectLandingPage(browser, projectTitle, 'Drafts');
    await browser.$('.licence-status-banner').$('a=Show more').click();
    assert.ok(await browser.$('.licence-status-banner.red .status').$('span=Refused').isDisplayed());
    assert.ok(await browser.$('.licence-status-banner.red').$('span*=This licence is not active.').isDisplayed());
  });
});
