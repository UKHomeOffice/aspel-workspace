import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';

const gotoEstablishmentDetails = async (browser, establishmentName) => {
  await browser.withUser('holc');
  await gotoEstablishment(browser, establishmentName);
  await browser.$('a=Establishment details').click();
};

describe('Establishment details page', () => {

  it('displays the establishment details', async () => {
    await gotoEstablishmentDetails(browser, 'University of Croydon');

    assert.ok(await browser.$('dd=XCC09J64D').isDisplayed(), 'Establishment licence number is displayed');
    assert.ok(await browser.$('dd*=99 George St, Croydon, CR0 1LD').isDisplayed(), 'Establishment address is displayed');
    assert.ok(await browser.$('a=Bruce Banner').isDisplayed(), 'Establishment licence holder is displayed if assigned');

    assert.ok((
      await browser.$('li=Regulated procedures on protected animals').isDisplayed() &&
      await browser.$('li=Breeding of relevant protected animals').isDisplayed() &&
      await browser.$('li=Supply of relevant protected animals').isDisplayed()
    ), 'Licenced procedures are displayed');

    await browser.$('h3=Conditions').click();
    await browser.$('.expanding-panel .content').waitForDisplayed();
    assert.ok(await browser.$('a=standard conditions of Section 2C licences').isDisplayed(), 'Additional conditions are displayed');
  });

  describe('Establishment details PDF', () => {
    it('can be downloaded as a PDF', async () => {
      await gotoEstablishmentDetails(browser, 'University of Croydon');
      await browser.$('a=View downloads').click();
      assert(await browser.$('a=Download licence as a PDF').isDisplayed(), 'There is a download link on the Establishment details page');
      const pdf = await browser.downloadFile('pdf');

      assert.ok(pdf.includes('University of Croydon'), 'Establishment name is displayed');
      assert.ok(pdf.includes('99 George St, Croydon, CR0 1LD'), 'Establishment address is displayed');
      assert.ok(pdf.includes('XCC09J64D'), 'Establishment licence number is displayed');

      assert.ok((
        pdf.includes('Regulated procedures on protected animals') &&
        pdf.includes('Breeding of relevant protected animals') &&
        pdf.includes('Supply of relevant protected animals')
      ), 'Licenced procedures are displayed');

      assert.ok(pdf.includes('Bruce Banner'), 'Establishment licence holder is displayed if assigned');

      assert.ok(pdf.includes('Lauren Jones'), 'NIO is displayed');
      assert.ok(pdf.includes('Neil Down, Yuz Lez, Ignaz Middell'), 'NTCOs are displayed');
      assert.ok(pdf.includes('Aaron Harris, Nathan Peters'), 'NVSs are displayed');
      assert.ok(pdf.includes('Megan Alberts, Ian Ayers, Benjamin Patton, Brian Proudfoot, Multiple Roles, John Sharp, Gareth Tindall'), 'NACWOs are displayed');

      assert.ok(pdf.includes('In addition to the standard conditions of Section 2C licences:'), 'Additional conditions are displayed');

      assert.ok(pdf.includes('2 Marsham Street') && pdf.includes('Vulcan House'), 'Approved areas are displayed');

      assert.ok(
        pdf.includes('The licence remains the property of the Secretary of State, and shall be surrendered to him on request.'),
        'Standard conditions are displayed'
      );
    });
  });

});
