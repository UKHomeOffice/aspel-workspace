import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';
import { completeSpecies } from '../../helpers/pil.js';

const visitPeoplePage = async browser => {
  await gotoEstablishment(browser, 'University of Croydon');
  await browser.$('a=People').click();
};

const visitPilPage = async (browser, name) => {
  await visitPeoplePage(browser);
  await browser.$('.search-box input[type="text"]').setValue(name);
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();

  const result = await browser.$$('td.name a').find(async a => await a.getText() === name);
  await result.click();
  await browser.$('a[href*="pil/create"]').click();
};

const createPilAsHolc = async (browser, name) => {
  await browser.withUser('holc');
  await visitPilPage(browser, name);
  await browser.$('form[action="?action=catAF"]').$('button').click();

  await browser.$('a=Training').click();
  await browser.$('label[for*="update-false"]').click();
  await browser.$('button=Continue').click();

  await browser.$('a=Procedures').click();
  await browser.$('label[for*=procedures-a]').click();
  await browser.$('button=Continue').click();

  await browser.$('a=Animal types').click();
  await completeSpecies(browser);

  await browser.$('.application-confirm .govuk-checkboxes__label').click();
  await browser.$('button=Continue').click();
  await browser.$('button=Submit to NTCO').click();
};

const createNtcoPil = async (browser) => {
  await browser.withUser('ntco');
  await visitPilPage(browser, 'Neil Down');
  await browser.$('form[action="?action=catAF"]').$('button').click();

  await browser.$('a=Procedures').click();
  await browser.$('label[for*=procedures-a]').click();
  await browser.$('button=Continue').click();

  await browser.$('a=Training').click();
  await browser.$('label[for*="update-false"]').click();
  await browser.$('button=Continue').click();

  await browser.$('a=Animal types').click();
  await completeSpecies(browser);

  await browser.$('.application-confirm .govuk-checkboxes__label').click();
  await browser.$('button=Continue').click();
  await browser.$('button=Submit to NTCO').click();
};

const visitNtcoTasklist = async browser => {
  await browser.withUser('ntco');
};

const visitPilEndorsementPage = async (browser, name) => {
  await visitNtcoTasklist(browser);
  await browser.$('.tasklist').$(`td*=${name}`).$('a=PIL application').click();
};

describe('PIL NTCO Endorsement', () => {
  before(async () => {
    await createPilAsHolc(browser, 'Hasnø Pil');
    await createPilAsHolc(browser, 'Gamaliel Wyburn');
  });

  it('has a PIL application awaiting endorsement in the tasklist', async () => {
    await visitNtcoTasklist(browser);
    assert(await browser.$('.tasklist').$('td*=Hasnø Pil').isDisplayed());
    assert(await browser.$('.tasklist').$('td*=Gamaliel Wyburn').isDisplayed());
  });

  it('can view the PIL to endorse', async () => {
    const name = 'Hasnø Pil';

    await visitPilEndorsementPage(browser, name);
    assert.equal(await browser.$('h1').getText(), 'Personal licence application');
    assert.ok(await browser.$('.task-details').$(`a=${name}`).isDisplayed(), 'there should be a link to the applicant profile');
  });

  it('can view animal typees', async () => {
    const name = 'Hasnø Pil';
    await visitPilEndorsementPage(browser, name);

    assert(!await browser.$('.species-diff ul.current').isDisplayed(), 'there should be no "current" list of species');
    assert(!await browser.$('.species-diff ul.proposed').isDisplayed(), 'there should be no "proposed" list of species');
    const species = await browser.$$('.species-diff li');
    assert.equal(await species[0].getText(), 'Babu');
    assert.equal(await species[1].getText(), 'Jabu');
    assert.equal(await species[2].getText(), 'Mice');
    assert.equal(await species[3].getText(), 'Rats');
  });

  it('can view procedures', async () => {
    const name = 'Hasnø Pil';
    await visitPilEndorsementPage(browser, name);

    assert(!await browser.$('.procedures-diff ul.current').isDisplayed(), 'there should be no "current" list of procedures');
    assert(!await browser.$('.procedures-diff ul.proposed').isDisplayed(), 'there should be no "proposed" list of procedures');
    const procedures = await browser.$$('.procedures-diff li');
    assert.equal(procedures.length, 1, 'there should be one procedure listed');
    const procedureText = await procedures[0].getText();
    assert(procedureText.includes('A. Minor / minimally invasive procedures not requiring sedation'), 'it should display procedure cat A');
  });

  it('requires a reason if the PIL application is rejected', async () => {
    await visitPilEndorsementPage(browser, 'Hasnø Pil');
    await browser.$('label[for*=status-returned-to-applicant]').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Return with comments').click();

    const errorMessage = await browser.$('.govuk-error-message');
    assert(errorMessage.isDisplayed());
    assert.equal(await errorMessage.getText(), 'Please provide a reason');
  });

  it('can change the endorsement decision before final submission', async () => {
    await visitPilEndorsementPage(browser, 'Hasnø Pil');
    await browser.$('label[for*=status-returned-to-applicant]').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Return with comments').isDisplayed());

    await browser.$('a=Cancel').click();
    await browser.$('label[for*=status-endorsed]').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Endorse application').isDisplayed());
    assert(await browser.$('.task-declaration').isDisplayed());
  });

  it('can submit an endorsement of a PIL to ASRU', async () => {
    await visitPilEndorsementPage(browser, 'Hasnø Pil');
    await browser.$('label[for*=status-endorsed]').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Endorse application').isDisplayed());
    assert(await browser.$('.task-declaration').isDisplayed());

    await browser.$('button=Endorse application').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');
  });

  it('can return the PIL to the applicant', async () => {
    await visitPilEndorsementPage(browser, 'Gamaliel Wyburn');
    await browser.$('label[for*=status-returned-to-applicant]').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Return with comments').isDisplayed());
    await browser.$('textarea[name="comment"]').setValue('Not suitable');

    await browser.$('button=Return with comments').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Returned');
  });

  it('displays a summary for each section on the edit and resubmit for a returned PIL', async () => {
    await browser.withUser('holc');
    await visitPilPage(browser, 'Gamaliel Wyburn');

    await browser.$('label=Edit and resubmit the application').click();
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('li.establishment p').getText(), 'University of Croydon');
    assert.equal(await browser.$('.procedures-diff li').getText(),
      'A. Minor / minimally invasive procedures not requiring sedation, analgesia or general anaesthesia.');

    let species = await browser.$$('div.species-diff li').map(link => link.getText());
    assert.deepStrictEqual(species, ['Babu', 'Jabu', 'Mice', 'Rats']);
    assert.equal(await browser.$('li.training em').getText(), 'No training added');
  });

});

describe('NTCO Endorsement of own PIL', () => {
  before(async () => {
    await createNtcoPil(browser);
  });

  it('the NTCOs PIL application does not appear in their own outstanding tasklist', async () => {
    await visitNtcoTasklist(browser);

    if (await browser.$('.tasklist').isDisplayed()) {
      const tasks = await browser.$('.tasklist').$$('td*=PIL application');
      for (const task of tasks) {
        assert(!await task.$('span*=Neil Down').isDisplayed());
      }
    } else {
      assert(true); // no tasklist, test pass (file run in isolation)
    }
  });

  it('the NTCOs PIL application is in their own in progress tasklist', async () => {
    await browser.withUser('ntco');
    await browser.$('a=In progress').click();
    assert(await browser.$('.tasklist').$('td*=Neil Down').isDisplayed());
  });

  it('an NTCO does not have the option to endorse their own PIL', async () => {
    await browser.withUser('ntco');
    await browser.$('a=In progress').click();
    await browser.$('//span[text()="Neil Down"]/ancestor::tr//a/span[text()="PIL application"]').click();

    const warningText = await browser.$('.govuk-warning-text').getText();
    assert(warningText.includes('You can’t endorse your own application for a personal licence.'), 'a warning should be displayed');
    assert(!await browser.$('label[for*=status-endorsed]').isDisplayed());
  });

  it('a different NTCO can endorse the PIL of another NTCO', async () => {
    await browser.withUser('basicntco');
    assert(await browser.$('.tasklist').$('td*=Neil Down').isDisplayed());

    await browser.$('//span[text()="Neil Down"]/ancestor::tr//a/span[text()="PIL application"]').click();

    assert(!await browser.$('.govuk-warning-text').isDisplayed(), 'a warning should not be displayed');

    await browser.$('label[for*=status-endorsed]').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('h1=Endorse application').isDisplayed());
    assert(await browser.$('.task-declaration').isDisplayed());

    await browser.$('button=Endorse application').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');
  });
});
