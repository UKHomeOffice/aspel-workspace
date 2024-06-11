import assert from 'assert';
import { gotoProjectLandingPage as gotoPublicProjectLandingPage } from '../../../public/helpers/project.js';
import { gotoProjectLandingPage as gotoInternalProjectLandingPage } from '../../../internal/helpers/project.js';

const completeRichTextField = async (browser, name, text) => {
  await browser.$(`#${name}`).click();
  await browser.keys(text);
  await browser.$(`span=${text}`).waitForDisplayed();
  await browser.waitForSync();
};

const completeSection = async (browser) => {
  await browser.$('button=Continue').click();
  await browser.$('label=This section is complete').click();
  await browser.$('button=Continue').click();
};

const addComment = async (browser, comment) => {
  // some buttons are hidden inside <details> elements
  // find the first one that is not contained in a <details>
  await browser.$('//button[.="Add comment" and not(ancestor::details)]').click();
  await browser.$('textarea#add-new-comment').setValue(comment);
  await browser.$('button=Save').click();
};

describe('RA', () => {
  describe('E2E', () => {
    const title = 'RA due revoked';

    it('can submit a new RA', async () => {
      await browser.withUser('basic');
      await gotoPublicProjectLandingPage(browser, title, 'Inactive');

      const startButton = await browser.$('button=Start assessment');
      assert.ok(await startButton.isDisplayed());
      await startButton.click();

      await browser.$('button=Continue').click();

      // complete application
      await browser.$('a=Project aims').click();
      await browser.$('label=No').click();

      await completeRichTextField(browser, 'aims-achieved', 'Yes the aims were achieved');
      await completeSection(browser);

      await browser.$('a=Harms').click();

      await completeRichTextField(browser, 'actual-harms', 'No harm came to any critters.');
      await completeSection(browser);

      await browser.$('a=Replacement').click();

      await completeRichTextField(browser, 'replacement', 'Realistic drawings of mice.');
      await completeSection(browser);

      await browser.$('a=Reduction').click();

      await completeRichTextField(browser, 'reduction', 'We set some free.');
      await completeSection(browser);

      await browser.$('a=Refinement').click();

      await completeRichTextField(browser, 'refinement', 'We did better experiments.');
      await completeSection(browser);

      await browser.waitForSync();

      await browser.$('button=Continue').click();

      assert.equal(await browser.$('h1').getText(), 'Submit retrospective assessment');
      await browser.$('textarea#comment').setValue('This is finished');

      await browser.$('button=Submit now').click();

      assert.ok(await browser.$('h1=Submitted').isDisplayed());
    });

    it('can endorse the assessment', async () => {
      await browser.withUser('holc');
      await gotoPublicProjectLandingPage(browser, title, 'Inactive');
      await browser.$('a=Retrospective assessment').click();

      await browser.$('label=Endorse retrospective assessment').click();
      await browser.$('button=Continue').click();

      await browser.$('input[name=ra-awerb-date-day]').setValue('12');
      await browser.$('input[name=ra-awerb-date-month]').setValue('12');
      await browser.$('input[name=ra-awerb-date-year]').setValue('2020');

      await browser.$('button=Agree and continue').click();

      await browser.$('button=Endorse retrospective assessment').click();

      assert.ok(await browser.$('h1=Endorsed').isDisplayed());
    });

    it('can comment on the application and return to applicant', async () => {
      await browser.withUser('inspector');
      await gotoInternalProjectLandingPage(browser, title, 'Inactive');
      await browser.$('a=Retrospective assessment').click();

      assert.ok(await browser.$('p=I agree that this retrospective assessment:').isDisplayed());
      assert.ok(await browser.$('p*=12 December 2020').isDisplayed());

      await browser.$('a=View retrospective assessment').click();

      await browser.$('a=Harms').click();

      await addComment(browser, 'Please change this');
      await browser.waitForSync();

      await browser.$('a=View all sections').click();
      await browser.$('a=Next steps').click();

      await browser.$('label=Return with comments').click();
      await browser.$('button=Continue').click();

      await browser.$('textarea#comment').setValue('Please see comments');

      await browser.$('button=Return with comments').click();

      assert.ok(await browser.$('h1=Returned').isDisplayed());
    });

    it('can respond to comments and resubmit', async () => {
      await browser.withUser('basic');
      await gotoPublicProjectLandingPage(browser, title, 'Inactive');
      await browser.$('a=Retrospective assessment').click();

      await browser.$('label=Edit and resubmit the retrospective assessment').click();
      await browser.$('button=Continue').click();

      assert.ok(await browser.$('span=1 new comment').isDisplayed());

      await browser.$('a=Harms').click();

      assert.ok(await browser.$('p=Please change this').isDisplayed());

      await browser.$(`#actual-harms`).click();
      await browser.keys('Some more text');

      await addComment(browser, 'OK done');

      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();
      await browser.waitForSync();
      await browser.$('button=Continue').click();

      await browser.$('button=Submit now').click();

      assert.ok(await browser.$('h1=Submitted').isDisplayed());
    });

    it('can re-endorse the assessment', async () => {
      await browser.withUser('holc');
      await gotoPublicProjectLandingPage(browser, title, 'Inactive');
      await browser.$('a=Retrospective assessment').click();

      await browser.$('label=Endorse retrospective assessment').click();
      await browser.$('button=Continue').click();

      await browser.$('input[name=ra-awerb-date-day]').setValue('13');
      await browser.$('input[name=ra-awerb-date-month]').setValue('12');
      await browser.$('input[name=ra-awerb-date-year]').setValue('2020');

      await browser.$('button=Agree and continue').click();

      await browser.$('button=Endorse retrospective assessment').click();

      assert.ok(await browser.$('h1=Endorsed').isDisplayed());
    });

    it('can check the changes and approve the RA', async () => {
      await browser.withUser('inspector');
      await gotoInternalProjectLandingPage(browser, title, 'Inactive');
      await browser.$('a=Retrospective assessment').click();

      await browser.$('p*=13 December 2020').waitForDisplayed();

      await browser.$('a=View retrospective assessment').click();

      await browser.$('a=Harms').click();

      await browser.$('p=OK done').waitForDisplayed();

      await browser.$("a=See what's changed").click();

      assert.equal(await browser.$('span.added').getText(), 'Some more text');

      await browser.$('a=Close').click();

      await browser.$('a=View all sections').click();
      await browser.$('a=Next steps').click();

      await browser.$('label=Approve retrospective assessment').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Approve retrospective assessment').click();

      assert.ok(await browser.$('h1=Approved').isDisplayed());
    });

    it('can verify the RA is shown on the digital NTS', async () => {
      await browser.withUser('holc');
      await gotoPublicProjectLandingPage(browser, title, 'Inactive');

      await browser.$('a=Non-technical summary and retrospective assessment').click();
      await browser.$('a=Objectives and benefits').click();

      assert.ok(await browser.$('.ra-summary').isDisplayed(), 'Expected RA summary to be displayed');
      assert.ok(await browser.$('p=No').isDisplayed());
      assert.ok(await browser.$('p=Yes the aims were achieved').isDisplayed());

      await browser.$('a=Predicted harms').click();
      assert.ok(await browser.$('p*=No harm came to any critters.').isDisplayed());

      await browser.$('a=Replacement').click();
      assert.ok(await browser.$('p=Realistic drawings of mice.').isDisplayed());

      await browser.$('a=Reduction').click();
      assert.ok(await browser.$('p=We set some free.').isDisplayed());

      await browser.$('a=Refinement').click();
      assert.ok(await browser.$('p=We did better experiments.').isDisplayed());
    });

    it('can verify the RA is shown on the downloaded PDF', async () => {
      await browser.withUser('holc');
      await gotoPublicProjectLandingPage(browser, title, 'Inactive');

      assert.ok(
        !(await browser.$('.govuk-warning-text.info').isDisplayed()),
        'RA due banner should no longer be displayed'
      );

      await browser.$('a=Non-technical summary and retrospective assessment').click();

      const pdf = await browser.downloadFile('pdf');

      assert.ok(await pdf.includes('Yes the aims were achieved'));
      assert.ok(await pdf.includes('No harm came to any critters.'));
      assert.ok(await pdf.includes('Realistic drawings of mice'));
      assert.ok(await pdf.includes('We set some free.'));
      assert.ok(await pdf.includes('We did better experiments.'));
    });
  });
});
