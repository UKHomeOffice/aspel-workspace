import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

const now = new Date();
// YEAR should either be the last year for the first 6 months of the year, or the current year if after.
const YEAR = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;

describe('Submitting a ROP', () => {

  before(async () => {
    await browser.withUser('holc');
  });

  it('Includes a review your answers step', async () => {
    await gotoProjectLandingPage(browser, 'ROP submission test');
    await browser.$('a=Reporting').click();
    await browser.$(`a=Continue return for ${YEAR}`).click();
    await browser.$('button=Continue to procedures').click();

    await browser.$('a=Submit return').click();

    assert(await browser.$('h1=Check your return').isDisplayed());
    assert(await browser.$('dd=Reason for no GA').isDisplayed());
  });

  it('Provides a link to edit the setup questions', async () => {
    await browser.$('a=Edit general details').click();

    assert(await browser.$('h1*=Change set up details').isDisplayed());
    await browser.$('a=Continue').click();

    // keep same answers
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click(); // species
    await browser.$('button=Continue').click(); // reuse
    await browser.$('button=Continue').click(); // birth
    await browser.$('button=Continue').click(); // schedule 2
    await browser.$('button=Continue').click(); // ga
    await browser.$('button=Continue').click(); // purpose
    await browser.$('button=Continue').click(); // techniques

    await browser.$('button=Continue to procedures').click();
  });

  it('Provides a link back to the review page from the declaration', async () => {
    await browser.$('a=Submit return').click();
    await browser.$('a=Continue').click();
    assert(await browser.$('h1=Declaration').isDisplayed());
    await browser.$('a=Back').click();
    assert(await browser.$('h1=Check your return').isDisplayed());
  });

  it('Can successfully submit a return', async () => {
    await browser.$('a=Continue').click();
    await browser.$('button=Agree and continue').click();
    await browser.$('button=Submit now').click();
    await browser.waitForSuccess();

    await gotoProjectLandingPage(browser, 'ROP submission test');
    await browser.$('a=Reporting').click();
    assert(await browser.$(`p*=The return for ${YEAR} was submitted on`).isDisplayed());
  });

});
