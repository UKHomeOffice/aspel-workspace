import assert from 'assert';
import { completeSpecies } from '../../helpers/pil.js';
import { usersWereNotified } from '../../../helpers/common.js';
import userRoles from '../../helpers/roles.js';
import pkg from 'lodash';
const { isEqual } = pkg;

const CREATE_TITLE = 'Choose personal licence (PIL) category';

const UPDATE_TITLE = 'Apply for personal licence - Categories A, B, C, D and F';

const SPECIES_TITLE = 'What types of animals are used for this personal licence?';

const PIL_TRAINING_TITLE = 'Training';
const MANAGE_TRAINING_TITLE = 'Training record';

const PROCEDURES_TITLE = 'Which procedures do you want to be licensed to carry out?';

const CAT_C_EXCERPT = 'Surgical procedures involving general anaesthesia';

const APPLICANT = 'vice-chancellor@example.com';
const CROYDON_ADMINS = userRoles[8201].admins;
const CROYDON_NTCOS = userRoles[8201].ntcos;

const visitPILPage = async browser => {
  await browser.url('/');
  await browser.$('h3=University of Croydon').click();
  await browser.$('.expanding-panel.open').$('a[href*="pil/create"]').click();
};

const checkSpecies = async browser => {
  assert(!await browser.$('.species-diff ul.current').isDisplayed(), 'there should be no "current" list of species');
  assert(!await browser.$('.species-diff ul.proposed').isDisplayed(), 'there should be no "proposed" list of species');
  const selectedSpecies = await browser.$$('.species-diff ul li');
  assert.equal(selectedSpecies.length, 4, 'there should be four selected species');
  for (const type of ['Babu', 'Jabu', 'Mice', 'Rats']) {
    assert.ok(await browser.$(`li=${type}`).isExisting());
  }
};

const checkEditedProcedures = async browser => {
  assert(!await browser.$('.procedures-diff ul.current').isDisplayed(), 'there should be no "current" list of procedures');
  assert(!await browser.$('.procedures-diff ul.proposed').isDisplayed(), 'there should be no "proposed" list of procedures');
  const selectedCategories = await browser.$$('.procedures-diff ul li');
  assert.equal(selectedCategories.length, 1, 'there should be one selected procedure category');
  const category = await selectedCategories[0].getText();
  assert(category.includes('A. Minor / minimally invasive procedures'));
};

describe('PIL Application', () => {

  before(async () => {
    await browser.withUser('holc');
  });

  it('shows the create page if PIL application not started', async () => {
    await visitPILPage(browser);
    const title = await browser.$('h1').getText();
    assert.equal(title, CREATE_TITLE);
  });

  it('redirects to the update page once PIL category is selected', async () => {
    await browser.$('button=Apply now').click();
    await browser.$(`h1=${UPDATE_TITLE}`).waitForDisplayed();
    const title = await browser.$('h1').getText();
    assert.equal(title, UPDATE_TITLE);
  });

  it('redirects straight to update page if PIL application has already started', async () => {
    await visitPILPage(browser);
    const title = await browser.$('h1').getText();
    assert.equal(title, UPDATE_TITLE);
  });

  it('can discard a draft application and create a new one', async () => {
    await browser.$('button=Discard draft application').click();
    await browser.acceptAlert();

    await browser.withUser('holc');

    await visitPILPage(browser);
    assert.equal(await browser.$('h1').getText(), CREATE_TITLE);

    await browser.$('form[action="?action=catAF"]').$('button').click();
    assert.equal(await browser.$('h1').getText(), UPDATE_TITLE);
  });

  it('shows "Applicant details" and "establishment" sections as completed', async () => {
    assert(await browser.$('li.section-item.establishment label.completed').isExisting());
    assert(await browser.$('li.section-item.details label.completed').isExisting());
    assert(!await browser.$('li.section-item.training label.completed').isExisting());
    assert(!await browser.$('li.section-item.exemptions label.completed').isExisting());
    assert(!await browser.$('li.section-item.procedures label.completed').isExisting());
    assert(!await browser.$('li.section-item.species label.completed').isExisting());
  });

  describe('Species', () => {
    before(async () => {
      await visitPILPage(browser);
      await browser.$('a=Animal types').click();
    });

    it('can visit the species page', async () => {
      const title = await browser.$('h1').getText();
      assert.equal(title, SPECIES_TITLE);
    });

    it('cannot be submitted without selecting species', async () => {
      await browser.$('button=Continue').click();

      assert.equal(await browser.$('h1').getText(), SPECIES_TITLE);
      assert.ok(await browser.$('#species-error').isExisting());
    });

    it('can add species to the PIL', async () => {
      await completeSpecies(browser);
      assert.equal(await browser.$('h1').getText(), UPDATE_TITLE);
      await checkSpecies(browser);
    });
  });

  describe('Certificates', () => {

    it('can add confirm training is up to date', async () => {
      await visitPILPage(browser);
      await browser.$('a=Training').click();
      assert.equal(await browser.$('h1').getText(), PIL_TRAINING_TITLE);
      await browser.$('label[for*="update-true"]').click();
      await browser.$('button=Continue').click();

      assert.equal(await browser.$('h1').getText(), MANAGE_TRAINING_TITLE);
      // dynamic link to continue PIL journey
      await browser.$('a=Resume Bruce Banner\'s personal licence application').click();

      await browser.$('label[for*="update-false"]').click();
      await browser.$('button=Continue').click();

      assert.equal(await browser.$('h1').getText(), UPDATE_TITLE);
      assert.ok(await browser.$('.section-item.training .status-label.completed').isDisplayed());
    });
  });

  describe('Procedures', () => {
    before(async () => {
      await visitPILPage(browser);
      await browser.$('a=Procedures').click();
    });

    it('can add a procedure', async () => {
      assert.equal(await browser.$('h1').getText(), PROCEDURES_TITLE);

      await browser.$('label[for*=procedures-a]').click();
      await browser.$('label[for*=procedures-b]').click();
      await browser.$('button=Continue').click();

      assert.equal(await browser.$('h1').getText(), UPDATE_TITLE);
      assert(!await browser.$('.procedures-diff ul.current').isDisplayed(), 'there should be no "current" list of procedures');
      assert(!await browser.$('.procedures-diff ul.proposed').isDisplayed(), 'there should be no "proposed" list of procedures');

      const selectedCategories = await browser.$$('li.section-item.procedures li');
      assert.equal(selectedCategories.length, 2, 'there should be two selected procedure categories');
      const first = await selectedCategories[0].getText();
      const second = await selectedCategories[1].getText();
      assert(first.includes('A. Minor / minimally invasive procedures'));
      assert(second.includes('B. Minor / minimally invasive procedures'));
    });

    it('can edit procedures', async () => {
      await browser.$('a=Procedures').click();

      await browser.$('label[for*=procedures-b]').click(); // remove B
      await browser.$('button=Continue').click();

      await checkEditedProcedures(browser);
    });
  });

  describe('completed PIL application', () => {
    before(async () => {
      await visitPILPage(browser);
    });

    it('clicking the submit without checking the declaration displays an error message', async () => {
      await browser.$('button=Continue').click();
      const errorMessage = await browser.$('.govuk-error-summary');
      assert(await errorMessage.isDisplayed());
      assert.equal(await errorMessage.$('a').getText(), 'Select to confirm that you understand.');
    });

    it('redirects to the success page on submit', async () => {
      await browser.$('input[name=declaration]').click();
      const submitTime = new Date();
      await browser.$('button=Continue').click();
      await browser.$('textarea').setValue('Applying for PIL');
      await browser.$('button=Submit to NTCO').click();
      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

      assert(usersWereNotified(await browser, [APPLICANT], 'task-change', submitTime), 'applicant should be sent task status change notification');
      assert(usersWereNotified(await browser, CROYDON_NTCOS, 'task-action', submitTime), 'NTCOs should be sent action required notification');
      assert(usersWereNotified(await browser, CROYDON_ADMINS, 'task-change', submitTime), 'admins should be sent task status change notification');
    });
  });

  describe('pil application in progress', () => {
    it('prevents the user accessing the application except through the task', async () => {
      await visitPILPage(browser);
      assert.equal(await browser.$('h1').getText(), 'Personal licence application', 'user is redirected to the task review page');
    });

    it('shows the correct species and procedures on the task', async () => {
      await visitPILPage(browser); // redirected to task
      await checkSpecies(browser);
      await checkEditedProcedures(browser);
    });
  });

  describe('update PIL task', () => {
    it('can be recalled and amended after submission', async () => {
      await browser.url('/');
      await browser.$('a=In progress').click();
      await browser.$('td*=Bruce Banner').$('a=PIL application').click();

      const recallTime = new Date();

      await browser.$('label=Recall application').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Recall application').click();

      assert(await browser.$('h1').getText(), 'Application recalled');

      assert(await usersWereNotified(browser, [APPLICANT], 'task-action', recallTime), 'applicant should be sent action required notification');
      assert(await usersWereNotified(browser, CROYDON_NTCOS, 'task-change', recallTime), 'NTCOs should be sent task status change notification');

      await browser.url('/');

      await browser.$('td*=Bruce Banner').$('a=PIL application').click();

      await browser.$('label=Edit and resubmit the application').click();
      await browser.$('button=Continue').click();
      await browser.$('a=Procedures').click();
      await browser.$('label[for*=procedures-c]').click();
      await browser.$('button=Continue').click();
      await browser.$('a=Training').click();
      await browser.$('label[for*="update-false"]').click();
      await browser.$('button=Continue').click();
      await browser.$('input[name=declaration]').click();
      await browser.$('button=Continue').click();

      const resubmitTime = new Date();
      await browser.$('button=Edit and resubmit the application').click();
      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence application');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
      assert(await usersWereNotified(browser, CROYDON_NTCOS, 'task-action', resubmitTime), 'NTCOs should be sent action required notification');

      await browser.url('/');
      await browser.$('a=In progress').click();
      await browser.$('td*=Bruce Banner').$('a=PIL application').click();

      assert.ok(await browser.$('#procedures').$(`span*=${CAT_C_EXCERPT}`).isDisplayed());
      const species = await browser.$$('#species li').map(li => li.getText());
      const expected = ['Babu', 'Jabu', 'Mice', 'Rats'];
      assert(isEqual(species, expected));
    });
  });

});
