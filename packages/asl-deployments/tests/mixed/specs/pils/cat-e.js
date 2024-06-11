import moment from 'moment';
import assert from 'assert';
import gotoCatESection from '../../../helpers/pil.js';

describe('Cat e pils', () => {
  before(async() => {
    await browser.withUser('trainingadmin');
  });

  it('can add a new user to a training course', async() => {
    await gotoCatESection();
    await browser.$('a=Training course to add participants to').click();
    await browser.$('a=Apply for a licence').click();
    await browser.$('[name="firstName"]').setValue('New');
    await browser.$('[name="lastName"]').setValue('User');
    await browser.$('[name="email"]').setValue('new.user@example.com');
    await browser.$('[name="dob-day"]').setValue('1');
    await browser.$('[name="dob-month"]').setValue('1');
    await browser.$('[name="dob-year"]').setValue('1970');
    await browser.$('[name="trainingNeed"]').setValue('I need to learn');
    await browser.$('button=Continue').click();
    await browser.$('button=Send for endorsement').click();

    let row = await browser.$('td=Training course to add participants to').$('..');
    let applications = await row.$('td.applications').getText();
    let licences = await row.$('td.licences').getText();

    assert.equal(applications, '1');
    assert.equal(licences, '0');

    await browser.withUser('trainingntco');
    await browser.$('td=Training Establishment').$('..').$('a=PIL-E application').click();

    assert.ok(await browser.$('dd=1 January 2025').isDisplayed());
    assert.ok(await browser.$('dd=Training project 1').isDisplayed());

    await browser.$('label=Endorse application').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Endorse application').click();

    assert.ok(await browser.$('.success=Endorsed').isDisplayed());

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await browser.$('td=Training Establishment').$('..').$('a=PIL-E application').click();
    await browser.$('label=Grant licence').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Grant licence').click();

    assert.ok(await browser.$('.success=Approved').isDisplayed());

    await browser.withUser('trainingadmin');
    await gotoCatESection();

    row = await browser.$('td=Training course to add participants to').$('..');
    applications = await row.$('td.applications').getText();
    licences = await row.$('td.licences').getText();

    assert.equal(applications, '1');
    assert.equal(licences, '1');
  });

  it('can view a granted cat e licence', async() => {
    await gotoCatESection();
    await browser.$('a=Training course to add participants to').click();
    await browser.$('a=View licence').click();

    assert.ok(await browser.$('dd=Training Establishment').isDisplayed());
    assert.ok(await browser.$(`dd=${moment().format('D MMMM YYYY')}`).isDisplayed());

    const procsDiff = await browser.$('.procedures-diff');
    assert.ok(await procsDiff.$('li=Mice').isDisplayed());
    assert.ok(await procsDiff.$('li=Rats').isDisplayed());
    assert.ok(await procsDiff.$(`dd=${moment().format('D MMMM YYYY')}`).isDisplayed());
    assert.ok(await procsDiff.$(`dd=${moment().add(3, 'months').format('D MMMM YYYY')}`).isDisplayed());
    assert.ok(await procsDiff.$('dd=Training Establishment').isDisplayed());
    assert.ok(await procsDiff.$('dd=Training project 1').isDisplayed());
    assert.ok(await procsDiff.$('dd=PR250147').isDisplayed());
  });

  it('can add normal pil categories through an amendment', async() => {
    await gotoCatESection();
    await browser.$('a=Training course to add participants to').click();
    await browser.$('a=View licence').click();
    await browser.$('a=Amend licence').click();
    await browser.$('button=Apply now').click();
    await browser.$('a=Procedures').click();
    await browser.$('label[for*="procedures-a"]').click();
    await browser.$('button=Continue').click();
    await browser.$('a=Animal types').click();
    await browser.$('summary=Small animals').click();
    await browser.$('label=Ferrets').click();
    await browser.$('button=Continue').click();
    await browser.$('a=Training').click();
    await browser.$('label=No, this training record is up to date').click();
    await browser.$('button=Continue').click();
    await browser.$('label[for*="declaration-true"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Submit to NTCO').click();
    assert.ok(await browser.$('.success=Submitted').isDisplayed());

    await browser.withUser('trainingntco');
    await browser.$('//td[contains(.,"Training Establishment")]/ancestor::tr//a[contains(.,"PIL application")]').click();

    assert.equal(await browser.$('ul.proposed li.diff strong').getText(), 'A.', 'RHS shows cat A being added');
    assert.equal(await browser.$('ul.proposed li:not(.diff) strong').getText(), 'E.', 'RHS shows existing cat E');
    assert.equal(await browser.$('ul.current li strong').getText(), 'E.', 'LHS shows existing cat E');

    await browser.$('label=Endorse application').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Endorse application').click();

    assert.ok(await browser.$('.success=Endorsed').isDisplayed());

    await browser.withUser('licensing');
    await browser.gotoOutstandingTasks();
    await browser.$('//td[contains(.,"Training Establishment")]/ancestor::tr//a[contains(.,"PIL application")]').click();
    await browser.$('label=Grant licence').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Grant licence').click();

    assert.ok(await browser.$('.success=Approved').isDisplayed());
  });

  it('can view the combined pil', async() => {
    await browser.withUser('trainingadmin');
    await browser.$('a=Go to Training Establishment').click();
    await browser.$('a=People').click();
    await browser.$('[name="filter"]').setValue('New User');
    await browser.$('button[type="submit"]').click();
    await browser.$('a=New User').click();
    await browser.$('a[href*="/pil/"]').click();

    assert.ok(await browser.$('dd=Ferrets').isDisplayed());
    assert.ok(await browser.$(`dd=${moment().add(5, 'years').format('D MMMM YYYY')}`).isDisplayed());

    assert.ok(await browser.$('li=A. Minor / minimally invasive procedures not requiring sedation, analgesia or general anaesthesia.').isDisplayed());
    assert.ok(await browser.$('//li[contains(.,"E. Education and training procedures conducted in accordance with Project Licence")]').isDisplayed());
  });

  it('can apply for cat E while holding PIL at secondary establishment', async() => {
    await browser.withUser('trainingadmin');
    await gotoCatESection();
    await browser.$('a=Training course to add participants to').click();
    await browser.$('a=Apply for a licence').click();
    await browser.$('[name="firstName"]').setValue('HasMarvellDifferentName');
    await browser.$('[name="lastName"]').setValue('Pil');
    await browser.$('[name="email"]').setValue('marvell-pil@example.com');
    await browser.$('[name="dob-day"]').setValue('01');
    await browser.$('[name="dob-month"]').setValue('01');
    await browser.$('[name="dob-year"]').setValue('1970');
    await browser.$('[name="trainingNeed"]').setValue('I need to learn');
    await browser.$('button=Continue').click();
    await browser.$('button=Send for endorsement').click();

    let row = await browser.$('td=Training course to add participants to').$('..');
    let applications = await row.$('td.applications').getText();
    let licences = await row.$('td.licences').getText();

    assert.equal(applications, '2');
    assert.equal(licences, '1');

    // endorsement from training pil establishment
    await browser.withUser('trainingntco');
    await browser.$('td=Training Establishment').$('..').$('a=PIL-E application').click();

    assert.ok(await browser.$('.task-details').$('dd=Marvell Pharmaceutical').isDisplayed(), 'PIL holding establishment displayed');
    assert.ok(await browser.$('.task-details').$('dd=HasMarvell Pil').isDisplayed(), 'Existing applicant name shown regardless of the name entered');
    assert.equal(await browser.$('ul.current li:first-child strong').getText(), 'B.', 'LHS shows existing cat B');
    assert.equal(await browser.$('ul.current li:nth-child(2) strong').getText(), 'C.', 'LHS shows existing cat C');

    assert.equal(await browser.$('ul.proposed li:first-child strong').getText(), 'B.', 'RHS shows existing cat B');
    assert.equal(await browser.$('ul.proposed li:nth-child(2) strong').getText(), 'C.', 'RHS shows existing cat C');
    assert.equal(await browser.$('ul.proposed li.diff strong').getText(), 'E.', 'RHS shows existing cat E being added');

    await browser.$('label=Endorse application').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Endorse application').click();

    assert.ok(await browser.$('.success=Endorsed').isDisplayed());

    // endorsement from pil holding establishment
    await browser.withUser('marvellntco');
    await browser.$('td=Marvell Pharmaceutical').$('..').$('a=PIL-E application').click();
    await browser.$('label=Endorse application').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Endorse application').click();

    assert.ok(await browser.$('.success=Endorsed').isDisplayed());

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await browser.$('td=Marvell Pharmaceutical').$('..').$('a=PIL-E application').click();
    await browser.$('label=Grant licence').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Grant licence').click();

    assert.ok(await browser.$('.success=Approved').isDisplayed());
  });

  it('can view the combined pil', async() => {
    await browser.withUser('trainingadmin');
    await browser.$('a=Go to Training Establishment').click();
    await browser.$('a=People').click();
    await browser.$('[name="filter"]').setValue('HasMarvell Pil');
    await browser.$('button[type="submit"]').click();
    await browser.$('a=HasMarvell Pil').click();
    await browser.$('a[href*="/pil/"]').click();

    assert.ok(await browser.$('dd=This licence is held at another establishment.').isDisplayed(), 'Main PIL holding est hidden');
    assert.ok(await browser.$('li=B. Minor / minimally invasive procedures involving sedation, analgesia or brief general anaesthesia. Plus surgical procedures conducted under brief non-recovery general anaesthesia').isDisplayed());
    assert.ok(await browser.$('li=C. Surgical procedures involving general anaesthesia. Plus - administration and maintenance of balanced or prolonged general anaesthesia.').isDisplayed());
    assert.ok(await browser.$('//li[contains(.,"E. Education and training procedures conducted in accordance with Project Licence")]').isDisplayed());
  });

  it('can revoke the cat E section of the combined PIL', async () => {
    await browser.withUser('trainingadmin');
    await gotoCatESection();
    await browser.$('a=Training course to add participants to').click();
    await browser.$('td=HasMarvell Pil').$('..').$('a=Revoke').click();
    await browser.$('[name="comments"]').setValue('No longer needed');
    await browser.$('button=Continue').click();
    await browser.$('button=Submit').click();

    await gotoCatESection();
    await browser.$('a=Training course to add participants to').click();

    const row = await browser.$('td=HasMarvell Pil').$('..');
    assert.ok(await row.$('td=Revocation pending').isDisplayed(), 'Expected revocation pending message');
    assert.ok(!await row.$('a=Revoke').isDisplayed(), 'Expected revoke link to not be visible');

    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await browser.$('td=Training Establishment').$('..').$('a=PIL-E revocation').click();

    assert.equal(await browser.$('ul.current li.diff.removed strong').getText(), 'E.');

    await browser.$('label=Revoke licence').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Revoke licence').click();

    assert.ok(await browser.$('.success=Revoked').isDisplayed());

    await browser.withUser('trainingadmin');
    await gotoCatESection();

    await browser.$('a=Training course to add participants to').click();
    assert.ok(await browser.$('td=HasMarvell Pil').$('..').$('td=REVOKED').isDisplayed());
  });
});
