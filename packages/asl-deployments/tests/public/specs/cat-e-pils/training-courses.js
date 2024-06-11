import assert from 'assert';
import moment from 'moment';
import gotoCatESection from '../../../helpers/pil.js';

describe('Training courses', () => {
  before(async() => {
    await browser.withUser('trainingadmin');
  });

  it('can add a new training course', async () => {
    await gotoCatESection();
    await browser.$('a=Add course details').click();

    await browser.$('input#projectId').setValue('PR');
    await browser.$('li=PR250147').click();
    await browser.waitUntil(async() => browser.$('input[name="projectId"]').getAttribute('value'));

    await browser.$('[name="title"]').setValue('New training course');
    await browser.$('[name="startDate-day"]').setValue('01');
    await browser.$('[name="startDate-month"]').setValue('01');
    await browser.$('[name="startDate-year"]').setValue(moment().add(1, 'year').format('YYYY'));
    await browser.$('summary=Small animals').click();
    await browser.$('input[value="Mice"]').click();

    await browser.$('button=Continue').click();

    await browser.$('h1=Check course details').waitForDisplayed();

    assert.ok(browser.$('dd=New training course').isDisplayed());
    assert.ok(browser.$('dd=Training project 1').isDisplayed());
    assert.ok(browser.$(`dd=1 January ${moment().add(1, 'year').format('YYYY')}`).isDisplayed());

    await browser.$('button=Confirm and continue').click();

    assert.equal(await browser.$('h1').getText(), 'Manage course participants');
  });

  it('can update a training course before any participants are added', async () => {
    await gotoCatESection();
    await browser.$('a=New training course').click();
    await browser.$('a=Edit course details').click();
    await browser.$('[name="title"]').setValue('New training course - updated title');

    await browser.$('button=Continue').click();

    assert.ok(browser.$('dd=New training course - updated title').isDisplayed());
    await browser.$('button=Submit').click();
    assert.ok(browser.$('dd=New training course - updated title').isDisplayed());
  });

  it('can delete a training course before any participants are added', async () => {
    await gotoCatESection();
    await browser.$('a=Training course to delete').click();
    await browser.$('button=Delete course').click();
    await browser.acceptAlert();
    const isDisplayed = await browser.$('a=Training course to delete').isDisplayed();
    assert.ok(isDisplayed === false);
  });

  it('can add a participant to the training course', async () => {
    await gotoCatESection();
    await browser.$('a=New training course - updated title').click();
    await browser.$('a=Apply for a licence').click();
    await browser.$('[name="firstName"]').setValue('Sterling');
    await browser.$('[name="lastName"]').setValue('Archer');
    await browser.$('[name="email"]').setValue('sterling.archer@example.com');
    await browser.$('[name="dob-day"]').setValue('01');
    await browser.$('[name="dob-month"]').setValue('01');
    await browser.$('[name="dob-year"]').setValue('1980');
    await browser.$('[name="trainingNeed"]').setValue('He needs mad skillz');
    await browser.$('button=Continue').click();
    await browser.$('button=Send for endorsement').click();

    const applications = await browser.$('td=New training course - updated title')
      .$('..')
      .$('td.applications')
      .getText();

    assert.equal(applications, '1');
  });

  it('can no longer update or delete the training course', async () => {
    await gotoCatESection();
    await browser.$('a=New training course - updated title').click();
    const editCourseDisplayed = await browser.$('a=Edit course details').isDisplayed();
    const deleteCourseDisplayed = await browser.$('button=Delete course').isDisplayed();
    assert.ok(editCourseDisplayed === false);
    assert.ok(deleteCourseDisplayed === false);
  });

  it('can revoke a participants pil-e', async () => {
    await gotoCatESection();
    await browser.$('a=Training course with active PIL-Es').click();
    await browser.$('a=Revoke').click();
    assert.ok(browser.$('h2=Abed Nadir').isDisplayed());
    assert.ok(browser.$('h1=Revoke category E licence').isDisplayed());

    await browser.$('button=Continue').click();
    assert.ok(browser.$('p=No remarks provided.').isDisplayed());
    await browser.$('button=Submit').click();

    assert.ok(browser.$('h1=Personal licence revocation').isDisplayed());
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });

  it('does not show procedures from revoked PILs on application task - bugfix', async () => {
    await gotoCatESection();
    // apply for a new PIL-E for user with revoked PIL
    await browser.$('a=New training course - updated title').click();
    await browser.$('a=Apply for a licence').click();
    await browser.$('[name="firstName"]').setValue('Brok');
    await browser.$('[name="lastName"]').setValue('Servis');
    await browser.$('[name="email"]').setValue('bservis17@example.com');
    await browser.$('[name="dob-day"]').setValue('01');
    await browser.$('[name="dob-month"]').setValue('01');
    await browser.$('[name="dob-year"]').setValue('1980');
    await browser.$('[name="trainingNeed"]').setValue('He needs mad skillz');
    await browser.$('button=Continue').click();
    await browser.$('button=Send for endorsement').click();

    await browser.waitForSuccess();

    // view task
    await browser.$('a=New training course - updated title').click();
    const closestTr = await browser.$('td=Brok Servis').closest('tr');
    const viewTask = await closestTr.$('a=View task');
    await viewTask.click();

    // procedures diff content with "before" content from revoked PIL should not appear
    const currentCategoriesDisplayed = await browser.$('=Current categories').isDisplayed();
    const warningDisplayed = await browser.$('=Minor / minimally invasive procedures not requiring sedation, analgesia or general anaesthesia.').isDisplayed();
    assert.ok(currentCategoriesDisplayed === false);
    assert.ok(warningDisplayed === false);
  });
});
