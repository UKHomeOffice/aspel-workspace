const gotoEstablishmentSearch = async (browser) => {
  await browser.url('/');
  const establishmentsLink = await browser.$('a[href*="/search/establishments"]');
  await establishmentsLink.click();
};

export async function gotoEstablishmentDashboard(browser, searchTerm, status) {
  await gotoEstablishmentSearch(browser);
  if (status) {
    const statusLink = await browser.$(`a=${status}`);
    await statusLink.click();
    await browser.$('table:not(.loading)').waitForExist();
  }
  const searchBox = await browser.$('.search-box input[type="text"]');
  await searchBox.setValue(searchTerm);
  const searchButton = await browser.$('.search-box button');
  await searchButton.click();
  await browser.$('table:not(.loading)').waitForExist();

  const searchTermLink = await browser.$(`a=${searchTerm}`);
  if (await searchTermLink.isExisting()) {
    await searchTermLink.click();
  } else {
    await browser.$('td.name a').click(); // else click the first result (e.g. search on establishment name)
  }
  await browser.$('h1=Establishment overview').waitForExist();
}

const gotoEstablishmentDetails = async (browser, searchTerm, status) => {
  await gotoEstablishmentDashboard(browser, searchTerm, status);
  await browser.$('a=Establishment details').click();
  await browser.$('h2=Related tasks').waitForExist(); // Use related tasks heading as it appears on Draft & Active
};

const performSearch = async (browser, term) => {
  const searchBox = await browser.$('.search-box input[type="text"]');
  await searchBox.waitForDisplayed();
  await searchBox.setValue(term);
  const searchButton = await browser.$('.search-box button');
  await searchButton.click();
  const table = await browser.$('table:not(.loading)');
  await table.waitForExist();
};

export {
  gotoEstablishmentSearch,
  gotoEstablishmentDetails,
  performSearch
};
