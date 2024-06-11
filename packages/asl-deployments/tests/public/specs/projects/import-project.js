import assert from 'assert';
import path, {dirname} from 'path';
import { gotoProjectList } from '../../helpers/project.js';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Create project', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  it('can import a .ppl file', async() => {
    await gotoProjectList(browser);
    await browser.$('a=Use existing template').click();

    const filePath = path.resolve(__dirname, '../../files/import.ppl');
    const remoteFilePath = await browser.uploadFile(filePath);
    await browser.$('input[name="upload"]').setValue(remoteFilePath);
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('.document-header').$('h2=Imported project').isDisplayed());
  });

});
