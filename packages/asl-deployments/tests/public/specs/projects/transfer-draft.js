import assert from 'assert';
import { gotoDraft, gotoProjectList } from '../../helpers/project.js';

const PROJECT_NAME = 'Transfer draft test';

const gotoChangeEstablishment = async(browser, projectName) => {
  await gotoDraft(browser, projectName);
  await browser.$('a=Establishments').click();
  await browser.$('a=Change').click();
};

const returnDraftToCroydon = async(browser) => {
  await gotoProjectList(browser, 'Small Pharma');
  await browser.$('a=Drafts').click();
  await browser.$(`a=${PROJECT_NAME}`).click();
  await browser.$('a=Open application').click();
  await browser.$('a=Establishments').click();
  await browser.$('a=Change').click();
  await browser.$('label=University of Croydon').click();
  await browser.$('button=Continue').click();
  await browser.$('button=Change primary establishment').click();
  assert(await browser.$('dd=University of Croydon').isDisplayed());
};

describe('Transfer draft project', () => {

  before(async() => {
    await browser.withUser('basic3'); // Imojean Addlestone
  });

  it('displays a link to change the primary establishment from the establishments section of the draft application', async() => {
    await gotoDraft(browser, PROJECT_NAME);
    await browser.$('a=Establishments').click();

    assert(await browser.$('h2=Primary establishment').isDisplayed());
    assert(await browser.$('p=University of Croydon').isDisplayed());

    await browser.$('a=Change').click();

    assert(await browser.$('h1=Change the primary establishment of this project').isDisplayed());
    assert(await browser.$('input[name="primaryEstablishment"][value="8201"]').isSelected());
  });

  it('displays an error if the form is submitted without changing the establishment', async() => {
    await gotoChangeEstablishment(browser, PROJECT_NAME);
    await browser.$('button=Continue').click();
    assert.equal(await browser.$('span.govuk-error-message').getText(), 'Please select a different primary establishment');
  });

  it('can go back and edit the establishment selection', async() => {
    await gotoChangeEstablishment(browser, PROJECT_NAME);
    await browser.$('label=Small Pharma').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Confirm change to primary establishment').isDisplayed());
    assert.equal(await browser.$('p.current-establishment').getText(), 'University of Croydon');
    assert.equal(await browser.$('p.new-establishment').getText(), 'Small Pharma');

    await browser.$('a=Edit').click();

    assert(await browser.$('h1=Change the primary establishment of this project').isDisplayed());
    assert(await browser.$('input[name="primaryEstablishment"][value="30001"]').isSelected());

    await browser.$('label=Marvell Pharmaceutical').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Confirm change to primary establishment').isDisplayed());
    assert.equal(await browser.$('p.current-establishment').getText(), 'University of Croydon');
    assert.equal(await browser.$('p.new-establishment').getText(), 'Marvell Pharmaceutical');
  });

  it('can cancel the change in establishment from the confirm page', async() => {
    await gotoChangeEstablishment(browser, PROJECT_NAME);
    await browser.$('label=Small Pharma').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Confirm change to primary establishment').isDisplayed());
    assert.equal(await browser.$('p.current-establishment').getText(), 'University of Croydon');
    assert.equal(await browser.$('p.new-establishment').getText(), 'Small Pharma');

    await browser.$('a=Cancel').click();

    assert(await browser.$('.document-header').$('h2=Transfer draft test').isDisplayed());
  });

  it('can change the primary establishment of a draft project', async() => {
    await gotoChangeEstablishment(browser, PROJECT_NAME);
    await browser.$('label=Small Pharma').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Confirm change to primary establishment').isDisplayed());
    assert.equal(await browser.$('p.current-establishment').getText(), 'University of Croydon');
    assert.equal(await browser.$('p.new-establishment').getText(), 'Small Pharma');

    await browser.$('button=Change primary establishment').click();

    assert(await browser.$('.document-header').$('h2=Transfer draft test').isDisplayed());

    await gotoProjectList(browser, 'University of Croydon');
    await browser.$('a=Drafts').click();
    await browser.$('.search-box input[type="text"]').setValue(PROJECT_NAME);
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert(!await browser.$(`a=${PROJECT_NAME}`).isDisplayed(), 'project draft should not exist under old establishment');

    await gotoProjectList(browser, 'Small Pharma');
    await browser.$('a=Drafts').click();
    await browser.$('.search-box input[type="text"]').setValue(PROJECT_NAME);
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert(await browser.$(`a=${PROJECT_NAME}`).isDisplayed(), 'project draft should exist under new establishment');

    await returnDraftToCroydon(browser);
  });
});
