import assert from 'assert';
import { gotoEstablishmentDashboard } from '../../helpers/establishment.js';
import { findTask } from '../../../helpers/task.js';
import { viewCase } from '../../../helpers/navigate.js';

const assertEstablishmentPage = async (page, text, isDisplayed) => {
  await gotoEstablishmentDashboard(browser, 'University of Croydon');
  await browser.$('a=' + page).click();
  assert.ok(await browser.$('p=' + text).isDisplayed() === isDisplayed);
};

const assertTaskListLabels = async (tasksWithOngoingEnforcement, tasksWithoutOngoingEnforcement) => {
  await browser.url('/');
  await browser.gotoOutstandingTasks();
  await browser.$('//a[*/text()="PEL"]').click();
  await browser.pause(1000);

  for (const task of tasksWithOngoingEnforcement) {
    const status = await getTaskStatus(task);
    assert.ok(await status.isDisplayed());
  }

  for (const task of tasksWithoutOngoingEnforcement) {
    const status = await getTaskStatus(task);
    assert.ok(await status.waitForExist({reverse: true}));
  }
};

const getTaskStatus = async (task) => {
  // Starting from the task link, find the first tr ancestor; from there, drill down to find the status span
  return browser.$(`//a/span[text()="${task}"]/ancestor::tr/descendant::span[text()="Ongoing enforcement"][1]`);
};

const assertTaskHasFlag = async (task, flag) => {
  await browser.url('/');
  await browser.gotoOutstandingTasks();
  const _task = await findTask(browser, 'a=' + task);
  await _task.click();
  assert.ok(await browser.$('p=' + flag).isDisplayed());
};

describe('Create enforcement case', () => {

  before(async () => {
    await browser.withUser('inspector');
  });

  it('can add a new enforcement case', async () => {

    await browser.$('a=Enforcement cases').click();
    await browser.$('a=Add new case').click();

    await browser.$('input[name="caseNumber"]').setValue('NEWCASE');
    await browser.$('button=Continue').click();

    await browser.$('#establishmentId').autocomplete('Croydon');
    await browser.$('button=Add establishment').click();

    await browser.$('#profile').autocomplete('Dagny Aberkirder');
    await browser.$('button=Add person').click();

    await browser.$('input[name="flagStatus"][value="open"]').click();
    await browser.$('input[name="flags"][value*="profile"]').click();
    await browser.$('input[name="flags"][value*="pil"]').click();
    await browser.$('button=Save').click();

    await browser.$('.govuk-warning-text.enforcement.open').waitForDisplayed();

    // it can take a short time for the search index to be updated
    await browser.pause(1000);

    await browser.$('a=View all enforcement cases').click();

    assert.ok(await browser.$('td=NEWCASE').isDisplayed());

    await browser.$('a=PIL: SN-682317').click();

    await assert.ok(await browser.$('.govuk-warning-text.enforcement.open').isDisplayed());
    await assert.ok(await browser.$('p=This personal licence is subject to ongoing enforcement activity under case NEWCASE').isDisplayed());

    await assertTaskHasFlag('Add named person (NIO)', 'This person is subject to ongoing enforcement activity under case NEWCASE');
  });

  it('does not show flags on non-flagged entities', async () => {
    await browser.$('a=Enforcement cases').click();
    const newCaseCell = await browser.$('td=NEWCASE');
    const closestTr = await newCaseCell.closest('tr');
    await closestTr.$('a=View case').click();

    await browser.$('a=Edit enforcement flag').click();
    await browser.$('input[name="flags"][value*="profile"]').click();
    await browser.$('button=Save').click();

    await browser.$('.govuk-warning-text.enforcement.open').waitForDisplayed();

    await browser.$('a=Dagny Aberkirder').click();

    assert.ok(!await browser.$('.govuk-warning-text.enforcement.open').isDisplayed());
  });

  it('cannot add a new enforcement case with the same case number', async () => {
    await browser.$('a=Enforcement cases').click();
    await browser.$('a=Add new case').click();

    await browser.$('input[name="caseNumber"]').setValue('NEWCASE');
    await browser.$('button=Continue').click();

    await assert.ok(browser.$('.govuk-error-message').isDisplayed());
  });

  it('can add and edit an establishment enforcement case', async () => {
    await browser.$('a=Enforcement cases').click();
    await browser.$('a=Add new case').click();

    await browser.$('input[name="caseNumber"]').setValue('PEL_CASE');
    await browser.$('button=Continue').click();

    await browser.$('#establishmentId').autocomplete('Croydon');
    await browser.$('button=Add establishment').click();

    const profile = await browser.$('#profile');
    await profile.autocomplete('Bruce Banner');
    await browser.$('button=Add person').click();

    await browser.$('input[name="flagStatus"][value="open"]').click();
    await browser.$('label=Bruce Banner\'s establishment licence at University of Croydon and related tasks').click();

    await browser.$('input[name="modelOptions"][value*="places"]').click();
    await browser.$('input[name="modelOptions"][value*="details"]').click();
    await browser.$('button=Save').click();

    await browser.$('.govuk-warning-text.enforcement.open').waitForDisplayed();

    await browser.$('a=View all enforcement cases').click();

    assert.ok(await browser.$('td=PEL_CASE').isDisplayed());

    await assertEstablishmentPage('Approved areas', 'This establishment\'s approved areas are subject to ongoing enforcement activity under case PEL_CASE', true);
    await assertEstablishmentPage('Establishment details', 'This establishment is subject to ongoing enforcement activity under case PEL_CASE', true);
    await assertEstablishmentPage('People', 'This establishment\'s named people are subject to ongoing enforcement activity under case PEL_CASE', false);

    await assertTaskListLabels(['Establishment amendment', 'New approved area'], ['Add named person (NACWO)']);
    await assertTaskHasFlag('Establishment amendment', 'This establishment is subject to ongoing enforcement activity under case PEL_CASE');
    await assertTaskHasFlag('New approved area', 'This establishment\'s approved areas are subject to ongoing enforcement activity under case PEL_CASE');

    // Modify the case to switch the options
    await browser.$('a=Enforcement cases').click();
    await viewCase('PEL_CASE');
    await browser.$('a=Edit enforcement flag').click();
    await browser.$('input[name="modelOptions"][value*="places"]').click();
    await browser.$('input[name="modelOptions"][value*="details"]').click();
    await browser.$('input[name="modelOptions"][value*="role"]').click();
    await browser.$('button=Save').click();

    await browser.$('.govuk-warning-text.enforcement.open').waitForDisplayed();

    await assertEstablishmentPage('Approved areas', 'This establishment\'s approved areas are subject to ongoing enforcement activity under case PEL_CASE', false);
    await assertEstablishmentPage('Establishment details', 'This establishment is subject to ongoing enforcement activity under case PEL_CASE', false);
    await assertEstablishmentPage('People', 'This establishment\'s named people are subject to ongoing enforcement activity under case PEL_CASE', true);

    await assertTaskListLabels(['Add named person (NACWO)'], ['Establishment amendment', 'New approved area']);

    await assertTaskHasFlag('Add named person (NACWO)', 'This establishment\'s named people are subject to ongoing enforcement activity under case PEL_CASE');
  });
});
