import assert from 'assert';
import moment from 'moment';
import { gotoProjectLandingPage, gotoDownloadsTab } from '../../helpers/project.js';

describe('Download tab', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  describe('Draft projects', () => {
    it('shows the correct download options for project applications', async() => {
      await gotoProjectLandingPage(browser, 'Draft project', 'Drafts');
      await gotoDownloadsTab(browser);

      assert.ok(await browser.$('h2=Licence application').isDisplayed(), 'the primary download type should be application');

      const subHeading = await browser.$('.project-download-links h3:first-of-type').getText();
      const today = moment().format('D MMMM YYYY');
      assert.deepStrictEqual(subHeading, `Application started ${today}`, 'the subheading should contain the start date');

      const applicationDocx = await browser.$('a=Download application (DOCX)').download('word');
      assert.ok(applicationDocx.includes('title of this project?'), 'a docx of the application can be downloaded (question)');
      assert.ok(applicationDocx.includes('Draft project'), 'a docx of the application can be downloaded (title)');

      const applicationPdf = await browser.$('a=Download application (PDF)').download('pdf');
      assert.ok(applicationPdf.includes('PROJECT LICENCE APPLICATION'), 'a pdf of the application can be downloaded');

      const licencePreviewPdf = await browser.$('a=Download licence preview (PDF)').download('pdf');
      assert.ok(licencePreviewPdf.includes('PROJECT LICENCE'), 'a pdf of the licence preview can be downloaded');
      assert.ok(licencePreviewPdf.includes('This licence is not active'), 'the preview should state it is not an active licence');
    });

    it('does not show deleted protocols in the licence preview', async() => {
      await gotoProjectLandingPage(browser, 'Project with deleted protocols', 'Drafts');
      await gotoDownloadsTab(browser);

      const licencePreviewPdf = await browser.$('a=Download licence preview (PDF)').download('pdf');
      assert(licencePreviewPdf.includes('First protocol'), 'The non-deleted protocol should be rendered into the PDF');
      assert(licencePreviewPdf.includes('Mice'), 'Species from the non-deleted protocol should be rendered into the PDF');
      assert(!licencePreviewPdf.includes('Deleted protocol'), 'The deleted protocol should not be rendered into the PDF');
      assert(!licencePreviewPdf.includes('Rats'), 'Species from the deleted protocol should not be rendered into the PDF');
    });
  });

  describe('Granted projects', () => {
    it('shows the correct download options for a granted project', async() => {
      await gotoProjectLandingPage(browser, 'Active project');
      await gotoDownloadsTab(browser);

      assert.ok(await browser.$('h2=Licence').isDisplayed(), 'the primary download type should be licence');

      assert.ok(await browser.$(`h3=Licence granted 23 April 2023`).isDisplayed(), 'the subheading should contain the project issue date');

      const licencePdf = await browser.$('a=Download licence (PDF)').download('pdf');
      assert.ok(licencePdf.includes('PROJECT LICENCE'), 'a pdf of the licence can be downloaded');
      assert.ok(licencePdf.includes('PR-X12345'), 'the licence pdf should contain the licence number');

      const applicationDocx = await browser.$('a=Download application (DOCX)').download('word');
      assert.ok(applicationDocx.includes('title of this project?'), 'a docx of the application can be downloaded (question)');
      assert.ok(applicationDocx.includes('Active project'), 'a docx of the application can be downloaded (title)');

      const applicationPdf = await browser.$('a=Download application (PDF)').download('pdf');
      assert.ok(applicationPdf.includes('PROJECT LICENCE APPLICATION'), 'a pdf of the application can be downloaded');
    });

    it('shows the correct download options for a legacy granted project', async() => {
      await gotoProjectLandingPage(browser, 'Legacy project');
      await gotoDownloadsTab(browser);

      assert.ok(await browser.$('h2=Licence').isDisplayed(), 'the primary download type should be licence');

      assert.ok(await browser.$(`h3=Licence granted 1 November 2023`).isDisplayed(), 'the subheading should contain the project issue date');

      const licencePdf = await browser.$('a=Download licence (PDF)').download('pdf');
      assert.ok(licencePdf.includes('PROJECT LICENCE'), 'a pdf of the licence can be downloaded');
      assert.ok(licencePdf.includes('PR-123456'), 'the licence pdf should contain the licence number');

      const applicationDocx = await browser.$('a=Download application (DOCX)').download('word');
      assert.ok(applicationDocx.includes('Project title'), 'a docx of the application can be downloaded (question)');
      assert.ok(applicationDocx.includes('Legacy project'), 'a docx of the application can be downloaded (title)');

      const applicationPdf = await browser.$('a=Download application (PDF)').download('pdf');
      assert.ok(applicationPdf.includes('PROJECT LICENCE'), 'a pdf of the application can be downloaded');
    });

    it('shows the correct download options for a granted project with previous versions', async() => {
      await gotoProjectLandingPage(browser, 'Basic user project');
      await gotoDownloadsTab(browser);

      assert.ok(await browser.$('h2=Licence').isDisplayed(), 'the primary download type should be licence');

      assert.ok(await browser.$(`h3=Licence granted 14 October 2023`).isDisplayed(), 'the subheading should contain the project issue date');

      const licencePdf = await browser.$('a=Download licence (PDF)').download('pdf');
      assert.ok(licencePdf.includes('PROJECT LICENCE'), 'a pdf of the licence can be downloaded');
      assert.ok(licencePdf.includes('PR-250872'), 'the licence pdf should contain the licence number');

      await browser.$('summary=Show older licence versions').click();
      await browser.$('h2=Previous licences').waitForDisplayed();

      const prevSubHeading = await browser.$('.previous-licences h3:first-of-type').getText();
      assert.deepStrictEqual(prevSubHeading, `Licence valid from 1 October 2023 until 14 October 2023`, 'the subheading for the previous licence should contain the validity period');

      const prevLicencePdf = await browser.$('.previous-licences').$('a=Download licence (PDF)').download('pdf');
      assert.ok(prevLicencePdf.includes('PROJECT LICENCE'), 'a pdf of the previous licence can be downloaded');
      assert.ok(prevLicencePdf.includes('SUPERSEDED'), 'the previous licence pdf should display the superseded banner');
      assert.ok(prevLicencePdf.includes('First basic user project title'), 'the previous licence pdf should contain the previous project title');
    });

    it('shows the correct download options for an amendment in progress', async() => {
      await gotoProjectLandingPage(browser, 'Amend in prog project');
      await gotoDownloadsTab(browser);

      assert.ok(await browser.$('h2=Licence amendment').isDisplayed(), 'the primary download type should be amendment');

      assert.ok(await browser.$(`h3=Amendment started 18 September 2023`).isDisplayed(), 'the subheading should contain the started date');

      const amendmentDocx = await browser.$('a=Download amendment (DOCX)').download('word');
      assert.ok(amendmentDocx.includes('title of this project?'), 'a docx of the amendment can be downloaded (question)');
      assert.ok(amendmentDocx.includes('Amend in prog project 2'), 'a docx of the amendment can be downloaded (title)');

      const amendmentPdf = await browser.$('a=Download amendment (PDF)').download('pdf');
      assert.ok(amendmentPdf.includes('PROJECT LICENCE APPLICATION'), 'a pdf of the amendment can be downloaded');

      const licencePreviewPdf = await browser.$('a=Download licence preview (PDF)').download('pdf');
      assert.ok(licencePreviewPdf.includes('PROJECT LICENCE'), 'a pdf of the licence preview can be downloaded');
      assert.ok(licencePreviewPdf.includes('This amendment has not been approved yet'), 'the preview should state it is not an active licence');
    });
  });

  describe('Expired projects', () => {
    it('shows the correct download options for an expired project', async() => {
      await gotoProjectLandingPage(browser, 'Expired project', 'Inactive');
      await gotoDownloadsTab(browser);

      assert.ok(await browser.$('h2=Expired licence').isDisplayed(), 'the primary download type should be expired licence');

      assert.ok(await browser.$(`h3=Licence valid from 23 April 2015 until 23 April 2018`).isDisplayed(), 'the subheading should contain the validity period');

      const licencePdf = await browser.$('a=Download licence (PDF)').download('pdf');
      assert.ok(licencePdf.includes('PROJECT LICENCE'), 'a pdf of the licence can be downloaded');
      assert.ok(licencePdf.includes('PR-X00001'), 'the licence pdf should contain the licence number');
      assert.ok(licencePdf.includes('EXPIRED'), 'the licence pdf should display the expired banner');

      const applicationDocx = await browser.$('a=Download application (DOCX)').download('word');
      assert.ok(applicationDocx.includes('title of this project?'), 'a docx of the application can be downloaded (question)');

      const applicationPdf = await browser.$('a=Download application (PDF)').download('pdf');
      assert.ok(applicationPdf.includes('PROJECT LICENCE APPLICATION'), 'a pdf of the application can be downloaded');
    });
  });

  describe('Revoked projects', () => {
    it('shows the correct download options for a revoked project', async() => {
      await gotoProjectLandingPage(browser, 'Revoked project', 'Inactive');
      await gotoDownloadsTab(browser);

      assert.ok(await browser.$('h2=Revoked licence').isDisplayed(), 'the primary download type should be revoked licence');

      assert.ok(await browser.$(`h3=Licence valid from 1 March 2015 until 23 April 2018`).isDisplayed(), 'the subheading should contain the validity period');

      const licencePdf = await browser.$('a=Download licence (PDF)').download('pdf');
      assert.ok(licencePdf.includes('PROJECT LICENCE'), 'a pdf of the licence can be downloaded');
      assert.ok(licencePdf.includes('PR-000000'), 'the licence pdf should contain the licence number');
      assert.ok(licencePdf.includes('REVOKED'), 'the licence pdf should display the expired banner');

      const applicationDocx = await browser.$('a=Download application (DOCX)').download('word');
      assert.ok(applicationDocx.includes('title of this project?'), 'a docx of the application can be downloaded (question)');

      const applicationPdf = await browser.$('a=Download application (PDF)').download('pdf');
      assert.ok(applicationPdf.includes('PROJECT LICENCE APPLICATION'), 'a pdf of the application can be downloaded');
    });
  });
});
