import assert from 'assert';
import { gotoGranted } from '../../helpers/project.js';

describe('General constraints', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  it('displays the general constraints on new projects', async() => {
    await gotoGranted(browser, 'Project with protocols');
    await browser.$('.section-nav').$('a=Protocols').click();
    assert(await browser.$('h2=General constraints').isDisplayed(), 'it displays the general constraints applicable to all protocols');

    await browser.$('summary=Show general constraints').doubleClick();
    assert(await browser.$('h3=Anaesthesia').isDisplayed(), 'it displays the Anaesthesia condition');
    assert(await browser.$('h3=General anaesthesia').isDisplayed(), 'it displays the General anaesthesia condition');
    assert(await browser.$('h3=Surgery').isDisplayed(), 'it displays the Surgery condition');
  });

  it('does not display the general constraints on legacy projects', async() => {
    await gotoGranted(browser, 'Legacy project');
    await browser.$('a=Protocols').click();
    assert(!await browser.$('h2=General constraints').isDisplayed(), 'it does not display the general constraints on legacy ppls');
  });

});
