import path, {dirname} from 'path';
import assert from 'assert';
import {fileURLToPath} from 'url';

import { createNewProject, gotoDraft } from '../../helpers/project.js';
import { captureAndCompareImage, findQRCodesInPDF, findQRCodesInDocx } from '../../helpers/images.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Create project', () => {
  const testImagePath = path.resolve(__dirname, '../../files/test-rte-image.png');
  let fullTitle;

  before(async() => {
    await browser.withUser('holc');
  });

  it('can add images to a rich text editor', async() => {
    fullTitle = await createNewProject(browser, 'Project with images');
    await browser.$('//a[text()="List of sections"]').click();
    await browser.$('a=Aims').click();
    await browser.$('h1=Aims').waitForExist();
    await browser.$('button=Continue').click();
    await browser.$('[name="project-aim"]').completeRichText('This is a lovely image:');
    await browser.$('#project-aim').richTextImage(testImagePath);
    await browser.waitForSync();
    await browser.$('button=Continue').click();

    await browser.call(async () => {
      return captureAndCompareImage(browser, '#project-aim img', testImagePath, 'rte-test')
        .then(isMatch => {
          assert.ok(isMatch, 'the captured image should match the uploaded image');
        });
    });
  });

  it('can add images with no text to a rich text editor', async() => {
    await gotoDraft(browser, fullTitle);
    await browser.$('a=Aims').click();
    await browser.$('h1=Aims').waitForExist();
    await browser.$('#project-importance').richTextImage(testImagePath);
    await browser.waitForSync();
    await browser.$('button=Continue').click();

    await browser.call(async() => {
      return captureAndCompareImage(browser, '#project-importance img', testImagePath, 'rte-test')
        .then(isMatch => {
          assert.ok(isMatch, 'the captured image should match the uploaded image');
        });
    });
  });

  it('images are included in the Word download', async() => {
    await gotoDraft(browser, fullTitle);
    await browser.$('.document-header').$('a*=downloads').click();
    const docx = await browser.$('a=Download application (DOCX)').download('raw');

    await browser.call(async() => {
      return findQRCodesInDocx(docx)
        .then(codes => {
          assert.ok(codes.every(code => code === 'Image embedded successfully'));
        });
    });
  });

  it('images are included in PDF download', async() => {
    await gotoDraft(browser, fullTitle);
    await browser.$('.document-header').$('a*=downloads').click();
    const data = await browser.$('a=Download application (PDF)').download('raw');

    await browser.call(async() => {
      return findQRCodesInPDF(data)
        .then(codes => {
          assert.ok(codes.every(code => code === 'Image embedded successfully'));
        });
    });
  });

});
