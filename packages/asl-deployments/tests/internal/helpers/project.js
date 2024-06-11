const gotoProjectSearch = async browser => {
  await browser.url('/search/projects'); // show all projects
  await browser.$('h2#search-title').$('span=Projects').waitForDisplayed();
};

// searchTerm can be anything that the project search matches on
const gotoProjectLandingPage = async (browser, searchTerm, status) => {
  await gotoProjectSearch(browser);

  if (status && browser.$(`a=${status}`).isDisplayed()) {
    await browser.$(`a=${status}`).click();
    await browser.$('table:not(.loading)').waitForExist();
  }

  await browser.$('.search-box input[type="text"]').setValue(searchTerm);
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();

  if (await browser.$(`a=${searchTerm}`).isExisting()) {
    await browser.$(`a=${searchTerm}`).click();
  } else {
    await browser.$('td.title a').click(); // else click the first result (e.g. search on licence number)
  }
  await browser.$('.overview').waitForExist();
};

const gotoProjectManagementPage = async (browser, searchTerm, status, establishmentName) => {
  await gotoProjectLandingPage(browser, searchTerm, status, establishmentName);
  await browser.$('nav.govuk-tabs').$('a*=Manage').click();
  await browser.$('.manage').waitForExist();
};

const gotoManageTab = async browser => {
  const liClass = await (await browser.$('a[href="#manage"]')).parentElement().getAttribute('class');
  if (liClass.includes('active')) {
    return;
  }
  await browser.$('a[href="#manage"]').click();
  await browser.$('.manage').waitForExist();
};

export {
  gotoProjectSearch,
  gotoProjectLandingPage,
  gotoProjectManagementPage,
  gotoManageTab
};
