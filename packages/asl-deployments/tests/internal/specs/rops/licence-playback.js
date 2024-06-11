import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

describe('ROPs licence playback', () => {

  before(async () => {
    await browser.withUser('inspector');
  });

  it('shows endangered species status correctly', async () => {
    await gotoProjectLandingPage(browser, 'ROP re-use/endangered/GAAs test');
    await browser.$('a=Reporting').click();
    await browser.$('button*=Start return').click();

    await browser.$('a=Continue').click();

    await browser.$('input[name="proceduresCompleted"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="postnatal"][value="true"]').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('li=Authorises or previously authorised use of endangered species').isDisplayed());

    await browser.$('input[name="endangered"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="nmbas"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="rodenticide"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Set up return');
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('li=Mice').isDisplayed());
    assert.ok(await browser.$('li=Rats').isDisplayed());

    await browser.$('input[name="otherSpecies"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('li=authorises or previously authorised reuse of animals').isDisplayed());

    await browser.$('input[name="reuse"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="placesOfBirth"][value="uk-licenced"]').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('li=Authorises or previously authorised use of genetically altered animals').isDisplayed());

  });

});
