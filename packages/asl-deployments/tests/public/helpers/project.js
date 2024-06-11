import moment from 'moment';
import { gotoEstablishment } from './establishment.js';

const gotoProjectList = async (browser, establishmentName = 'University of Croydon') => {
  await gotoEstablishment(browser, establishmentName);
  await browser.$('a=Projects').click();
};

// searchTerm can be anything that the project search matches on
const gotoProjectLandingPage = async (browser, searchTerm, status = 'Active', establishmentName = 'University of Croydon') => {
  await gotoProjectList(browser, establishmentName);
  function getXPath(status, shouldBeActive = false) {
    return `//nav[@class="govuk-tabs"]//a[span[contains(text(), "${status}")]${shouldBeActive ? ' and ancestor::li[@class="active"]' : ''}]`;
  }

  let retries = 3;
  do {
    switch (status) {
      case 'Active':
      case 'Drafts':
        if (!await browser.$(getXPath(status, true)).isDisplayed()) {
          await browser.$(getXPath(status)).click();
        }
        await browser.$(getXPath(status, true)).waitForExist();
        break;

      default: // All other statuses use the Inactive tab
        await browser.$(getXPath('Inactive')).click();
        await browser.$(getXPath('Inactive', true)).waitForExist();
        break;
    }

    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('.search-box input[type="text"]').setValue(searchTerm);
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
  } while (!(await browser.$(`//table[contains(., "${searchTerm}")]`).isDisplayed()) && --retries > 0);

  // Wait for at least one row to exist
  const firstEntry = await browser.$('td.title a');
  await firstEntry.waitForExist();

  if (await browser.$(`a=${searchTerm}`).isDisplayed()) {
    await browser.$(`a=${searchTerm}`).click();
  } else {
    await firstEntry.click(); // else click the first result (e.g. search on licence number)
  }
  await browser.$('.overview').waitForExist();
};

const gotoProjectManagementPage = async (browser, searchTerm, status, establishmentName) => {
  await gotoProjectLandingPage(browser, searchTerm, status, establishmentName);
  await browser.$('a[href="#manage"]').click();
  await browser.$('.manage').waitForExist();
};

const gotoOverviewTab = async browser => {
  const classAttribute = await browser.$('a[href="#overview"]').parentElement().getAttribute('class');
  if (classAttribute.includes('active')) {
    return;
  }
  await browser.$('a[href="#overview"]').click();
  await browser.$('.overview').waitForExist();
};

const gotoManageTab = async browser => {
  const classAttribute = await browser.$('a[href="#manage"]').parentElement().getAttribute('class');
  if (classAttribute.includes('active')) {
    return;
  }
  await browser.$('a[href="#manage"]').click();
  await browser.$('.manage').waitForExist();
};

const gotoHistoryTab = async browser => {
  const classAttribute = await browser.$('a[href="#history"]').parentElement().getAttribute('class');
  if (classAttribute.includes('active')) {
    return;
  }
  await browser.$('a[href="#history"]').click();
  await browser.$('.project-history').waitForExist();
};

const gotoDownloadsTab = async browser => {
  const element = await browser.$('a[href="#downloads"]').parentElement();
  const classes = await element.getAttribute('class');
  if (classes.includes('active')) {
    return;
  }
  await browser.$('a[href="#downloads"]').click();
  await browser.$('.project-download-links').waitForExist();
};

const gotoDraft = async (browser, searchTerm) => {
  await gotoProjectLandingPage(browser, searchTerm, 'Drafts');
  await browser.$('=Open application').click();
};

const gotoGranted = async (browser, searchTerm) => {
  await gotoProjectLandingPage(browser, searchTerm);
  await browser.$('=View licence').click();
};

const gotoExpired = async (browser, searchTerm) => {
  await gotoProjectLandingPage(browser, searchTerm, 'Expired');
  await browser.$('=View licence').click();
};

const gotoRevoked = async (browser, searchTerm) => {
  await gotoProjectLandingPage(browser, searchTerm, 'Revoked');
  await browser.$('=View licence').click();
};

const createNewProject = async(browser, title, addTitleTimestamp = true) => {
  await gotoProjectList(browser);
  await browser.$('button=Apply for project licence').click();
  await browser.$('.document-header').$('h2=Untitled project').waitForExist();

  await browser.$('a=Introductory details').click();

  const fullTitle = addTitleTimestamp
    ? `${title} ${(moment(new Date()).format('DD/MM/YY HH:mm:ss'))}`
    : title;

  await browser.$('input[name="title"]').setValue(fullTitle);
  await browser.waitForSync();
  return fullTitle;
};

// from project section index
const submitAmendment = async(browser, comment = 'Testing amendment') => {
  await browser.$('button=Continue').click();
  await completeAwerb(browser);
  await browser.$('textarea[name=comments]').setValue(comment);
  await browser.$('button*=Submit PPL amendment').click();
};

const submitApplication = async (browser, comment = 'Testing amendment') => {
  await browser.$('button=Continue').click();
  await completeAwerb(browser);
  await browser.$('textarea[name=comment]').setValue(comment);
  await browser.$('button*=Submit PPL application').click();
};

const completeAwerb = async(browser, exempt = false) => {
  if (await browser.$('input[name="awerb-exempt"][value="false"]').isExisting()) {
    if (exempt) {
      await browser.$('input[name="awerb-exempt"][value="true"]').click();
      await browser.$('textarea[name="awerb-no-review-reason"]').setValue('AWERB Not required');
      return;
    }
    await browser.$('input[name="awerb-exempt"][value="false"]').click();
  }

  const dateGroups = await browser.$$('.govuk-date-input');
  for (const dateGroup of dateGroups) {
    const dayInput = await dateGroup.$('.//input[@type="number" and contains(@name,"day")]');
    await dayInput.setValue('01');
    const monthInput = await dateGroup.$('.//input[@type="number" and contains(@name,"month")]');
    await monthInput.setValue('01');
    const yearInput = await dateGroup.$('.//input[@type="number" and contains(@name,"year")]');
    await yearInput.setValue('2021');
  }
};

const discardDraft = async(browser, searchTerm) => {
  await gotoProjectManagementPage(browser, searchTerm, 'Drafts');

  const discardButton = await browser.$('button=Discard draft');

  if (await discardButton.isDisplayed()) {
    await discardButton.click();
    await browser.acceptAlert();
    await browser.$('h1=Projects').waitForExist();
  }
};

const discardAmendment = async(browser, searchTerm) => {
  await gotoProjectManagementPage(browser, searchTerm);

  const discardButton = await browser.$('button=Discard this amendment');

  if (await discardButton.isDisplayed()) {
    await discardButton.click();
    await browser.acceptAlert();
    await browser.$('li.active').$('a=Project overview').waitForExist();
  }
};

const discardTask = async(browser, searchTerm) => {
  await gotoProjectManagementPage(browser, searchTerm);
  await browser.$('a*=View task').click();
  await browser.$('label*=Discard').waitForExist();
  await browser.$('label*=Discard').click();
  await browser.$('button=Continue').click();
  await browser.$('button*=Discard').waitForExist();
  await browser.$('button*=Discard').click();
};

export {
  gotoProjectList,
  gotoProjectLandingPage,
  gotoProjectManagementPage,
  gotoOverviewTab,
  gotoManageTab,
  gotoHistoryTab,
  gotoDownloadsTab,
  gotoDraft,
  gotoGranted,
  gotoExpired,
  gotoRevoked,
  createNewProject,
  completeAwerb,
  discardDraft,
  discardAmendment,
  submitAmendment,
  submitApplication,
  discardTask
};
