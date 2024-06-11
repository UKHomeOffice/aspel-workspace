import assert from 'assert';
import {
  gotoDraft,
  gotoGranted,
  gotoExpired,
  gotoRevoked
} from '../../helpers/project.js';

describe('View project', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  it('can view a draft project', async() => {
    await gotoDraft(browser, 'Draft project');
    assert.ok(await browser.$('.document-header').$('h2=Draft project').isDisplayed(), 'Project title should be displayed');
  });

  it('can view a granted project', async() => {
    await gotoGranted(browser, 'Basic user project');
    assert.ok(await browser.$('.document-header').$('h2=Basic user project').isDisplayed(), 'Project title should be displayed');
  });

  it('can view an expired project', async() => {
    await gotoExpired(browser, 'Search for the luminescent aether');
    assert.ok(await browser.$('.document-header').$('h2=Search for the luminescent aether').isDisplayed(), 'Project title should be displayed');
  });

  it('can view a revoked project', async() => {
    await gotoRevoked(browser, 'Revoked project');
    assert.ok(await browser.$('.document-header').$('h2=Revoked project').isDisplayed(), 'Project title should be displayed');
  });

  it('can expand/collapse all protocol sections', async() => {
    await gotoGranted(browser, 'Basic user project');

    await browser.$('a=Protocols').click();
    await browser.$$('section.protocol')[0].click();
    const expandingPanels = await browser.$$('.accordion > .expanding-panel');

    await browser.$('a=Open all sections').click();
    for (const panel of expandingPanels) {
      const content = await panel.$('.content');
      assert.ok(await content.isDisplayed());
    }

    await browser.$('a=Close all sections').click();
    for (const panel of expandingPanels) {
      const content = await panel.$('.content');
      assert.ok(!await content.isDisplayed());
    }
  });

  it('can download as word', async() => {
    await gotoDraft(browser, 'Draft project');
    const word = await browser.downloadFile('word');
    assert.ok(word.includes('Introductory details'));
  });

  it('can download as pdf', async() => {
    await gotoDraft(browser, 'Draft project');
    const pdf = await browser.downloadFile('pdf');
    assert.ok(pdf.includes('PROJECT LICENCE'));
  });

  it('can see permissible purposes', async() => {
    await gotoGranted(browser, 'Basic user project');
    assert.ok(await browser.$('li=(a) Basic research').isDisplayed());
  });

  it('can see permissible purposes for training projects', async() => {
    await gotoGranted(browser, 'Training licence');
    assert.ok(await browser.$('li=(f) Higher education and training').isDisplayed());
  });

  it('shows PEL holder name', async() => {
    await gotoGranted(browser, 'Basic user project');
    assert.ok(await browser.$('dt=Establishment licence holder:').$('..').$('dd=Bruce Banner').isDisplayed());
  });

});
