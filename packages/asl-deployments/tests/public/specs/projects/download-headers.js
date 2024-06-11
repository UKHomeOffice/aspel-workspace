import assert from 'assert';
import {
  gotoProjectManagementPage,
  gotoDraft,
  gotoGranted
} from '../../helpers/project.js';

describe('Download header', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  describe('Draft projects', () => {

    it('the application downloads are displayed', async() => {
      await gotoDraft(browser, 'Draft project');
      await browser.$('.document-header').$('a*=downloads').click();
      assert(await browser.$('a=Download application (DOCX)').isDisplayed(), 'there should be a word application download link');
      assert(await browser.$('a=Download application (PDF)').isDisplayed(), 'there should be a pdf application download link');
    });

    it('the licence preview download is not displayed', async() => {
      await gotoDraft(browser, 'Draft project');
      await browser.$('.document-header').$('a*=downloads').click();
      assert(!await browser.$('a=Download licence preview (PDF)').isDisplayed(), 'there should not be a licence preview download link');
    });

  });

  describe('Active projects', () => {

    it('the licence download link is present', async() => {
      await gotoGranted(browser, 'Download test project');
      await browser.$('.document-header').$('a*=downloads').click();
      assert(await browser.$('a=Download licence (PDF)').isDisplayed(), 'there should be a licence pdf download link');
    });

    it('no licence status banner appears on the pdf download', async() => {
      await gotoGranted(browser, 'Download test project');
      const pdf = await browser.downloadFile('pdf');
      assert(!pdf.includes('This licence is not active.'), 'it should not display the licence banner for active project pdfs');
    });

    it('includes permissible purpose questions in pdf download', async() => {
      await gotoGranted(browser, 'Download test project');
      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('(a) Basic research'));
    });

    it('includes permissible purpose questions in pdf download for a training project', async() => {
      await gotoGranted(browser, 'Training licence');
      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('(f) Higher education and training'));
    });

  });

  describe('Amendment to active project', () => {

    it('the pdf application download link is present', async() => {
      await gotoProjectManagementPage(browser, 'Amend in prog project');
      await browser.$('a=View task').click();
      await browser.$('a=View latest submission').click();

      await browser.$('.document-header').$('a*=downloads').click();
      assert(await browser.$('a=Download amendment (PDF)').isDisplayed(), 'there should be an application pdf download link');
      assert(await browser.$('a=Download amendment (DOCX)').isDisplayed(), 'there should be an application word download link');
    });

  });

});
