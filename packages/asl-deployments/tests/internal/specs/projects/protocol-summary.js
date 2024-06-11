import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

describe('Protocol summary table', () => {

  before(async () => {
    await browser.withUser('inspector');
  });

  it('does not show deleted protocols', async () => {
    await gotoProjectLandingPage(browser, 'deleted protocols');
    await browser.$('a=Open application').click();
    await browser.$('a=Protocols').click();
    await browser.$('a*=View summary table').click();

    // protocol summary opens in a new window
    await browser.switchWindow(/protocol-summary/);

    assert.equal(await browser.$$('tbody tr.expandable').length, 1);
    assert.ok(!await browser.$('td=Deleted protocol').isExisting());
  });

});
