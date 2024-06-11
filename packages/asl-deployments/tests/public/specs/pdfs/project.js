import pdf from '@cyber2024/pdf-parse-fixed';
import assert from 'assert';
import path, { dirname } from 'path';
import fs from 'fs';
import { gotoProjectList, gotoProjectLandingPage, gotoDownloadsTab } from '../../helpers/project.js';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const parsePDF = data => pdf(Buffer.from(data, 'binary'))
  .then(result => result.text.replace(/\s/g, ' '));

const stripDownloadDate = str => {
  return str.replace(/Downloaded: ([0-9:, apm]+ (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 202[0-9]{1})/g, () => '');
};

async function assertPdfMatches(pdf, downloadLink) {
  const expected = fs.readFileSync(path.resolve(__dirname, '../../files/' + pdf));
  const output = stripDownloadDate(await browser.downloadFile({type: 'pdf', selector: 'a=' + downloadLink}));

  return parsePDF(expected)
    .then(text => stripDownloadDate(text))
    .then(text => {
      let i = 0;
      const chunk = 50;
      while (i * chunk < text.length) {
        assert.equal(output.substr(i * chunk, chunk), text.substr(i * chunk, chunk));
        i++;
      }
    });
}

describe('Project PDF', () => {
  before(async () => {
    await browser.withUser('holc');
    await gotoProjectList(browser);
    await browser.$('a=Use existing template').click();

    const filePath = path.resolve(__dirname, '../../files/pdf-regression.ppl');
    const remoteFilePath = await browser.uploadFile(filePath);
    await browser.$('input[name="upload"]').setValue(remoteFilePath);
    await browser.$('button=Continue').click();
  });

  it('content matches expectation', async () => {
    return assertPdfMatches('pdf-regression.pdf', 'Download application (PDF)');
  });

});

describe('Project with protocols PDFs', () => {
  before(async () => {
    await browser.withUser('holc');
    await gotoProjectLandingPage(browser, 'Project with protocols');
    await gotoDownloadsTab(browser);
  });

  it('Licence PDF matches expectation', () => {
    return assertPdfMatches('project-with-protocols-licence.pdf', 'Download licence (PDF)');
  });

  it('Protocol steps PDF matches expectation', () => {
    return assertPdfMatches('project-with-protocols-protocol_steps.pdf', 'Download protocol steps (PDF)');
  });

  it('Non-technical summary PDF matches expectation', () => {
    return assertPdfMatches('project-with-protocols-non_technical_summary.pdf', 'Non-technical summary (PDF)');
  });

});
