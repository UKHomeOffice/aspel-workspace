import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';

const gotoPil = async (browser, name, establishmentName = 'University of Croydon') => {
  await gotoProfile(browser, name, establishmentName);
  await browser.$('a[href*="/pil/"]').click();
};

describe('PIL view page', () => {

  it('shows notes relating to Cat F PIL', async () => {
    await browser.withUser('holc');
    await gotoPil(browser, 'Law Rennox');
    const text = await browser.$('.model-summary').getText();
    assert.ok(text.includes('Some notes about my cat F PIL'), 'Cat F notes should be displayed');
  });

  it('displays the primary establishment if viewing PIL from the current establishment', async () => {
    await browser.withUser('holc');
    await gotoPil(browser, 'Mixed Permissions', 'University of Croydon');
    assert.ok(await browser.$('dd=University of Croydon').isDisplayed(), 'The establishment should be displayed');
  });

  it('displays the primary establishment if viewing with a user who has permissions at the holding establishment', async () => {
    await browser.withUser('holc');
    await gotoPil(browser, 'Mixed Permissions', 'Marvell Pharmaceutical');
    assert.ok(await browser.$('dd=University of Croydon').isDisplayed(), 'The establishment should be displayed');
  });

  it('does not display the primary establishment if viewing PIL from a different establishment', async () => {
    await browser.withUser('pharmaadmin');
    await gotoPil(browser, 'Mixed Permissions', 'Marvell Pharmaceutical');
    assert.ok(!await browser.$('dd=University of Croydon').isDisplayed(), 'The establishment should not be displayed');
    assert.ok(await browser.$('dd=This licence is held at another establishment.').isDisplayed(), 'An alternative message should be displayed');
  });

  describe('PIL PDF', () => {
    beforeEach(async () => {
      await browser.withUser('holc');
    });

    it('can be downloaded as a PDF', async () => {
      await gotoPil(browser, 'Law Rennox');
      await browser.$('a=View downloads').click();
      assert(await browser.$('a=Download licence as a PDF').isDisplayed(), 'There is a download link on the PIL view page');

      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('Law Rennox'), 'PIL holder name is displayed');
      assert.ok(pdf.includes('SM-402875'), 'PIL number is displayed');
    });

    it('displays the primary establishment on PDF', async () => {
      await gotoPil(browser, 'Mixed Permissions', 'University of Croydon');
      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('Primary establishment'), 'The primary establishment section should be displayed');
      assert.ok(pdf.includes('University of Croydon'), 'The name of the primary establishment should be displayed');
    });

    it('displays the primary establishment on PDF if accessed through a different establishment', async () => {
      await gotoPil(browser, 'Mixed Permissions', 'Marvell Pharmaceutical');
      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('Primary establishment'), 'The primary establishment section should be displayed');
      assert.ok(pdf.includes('University of Croydon'), 'The name of the primary establishment should be displayed');
    });

    it('can be downloaded by an admin at a related establishment but the primary establishment is hidden', async () => {
      // Admin at Marvell Pharma but not at Croydon so can download user's PIL, but Croydon name will be hidden
      await browser.withUser('pharmaadmin');
      await gotoPil(browser, 'Ignaz Middell', 'Marvell Pharmaceutical');
      await browser.$('a=View downloads').click();
      assert.ok(await browser.$('a=Download licence as a PDF').isExisting(), 'The download link should be displayed');
      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('Primary establishment'), 'The primary establishment section should be displayed');
      assert.ok(!pdf.includes('University of Croydon'), 'The name of the primary establishment should not be displayed');
      assert.ok(pdf.includes('This licence is held at another establishment'), 'Held at another establishment should be displayed');
    });
  });
});
