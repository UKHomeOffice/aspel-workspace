import assert from 'assert';
import { gotoEstablishment } from './establishment.js';

const gotoProfile = async (browser, name, establishmentName = 'University of Croydon') => {
  await gotoEstablishment(browser, establishmentName);
  await browser.$('a=People').click();
  await browser.$('h1=People').waitForDisplayed();

  await browser.$('.search-box input[type="text"]').waitForExist();
  await browser.$('.search-box input[type="text"]').setValue(name);
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();
  await browser.$('table').$(`a=${name}`).click();
  await browser.$(`h1=${name}`).waitForExist();
  assert.equal(await browser.$('h1').getText(), name);
};

export {
  gotoProfile
};
