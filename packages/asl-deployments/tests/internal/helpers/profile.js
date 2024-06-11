const gotoProfileSearch = async browser => {
  await browser.url('/search/profiles');
  await browser.$('h2#search-title').$('span=People').waitForDisplayed();
};

// searchTerm can be anything that the project search matches on
const gotoProfilePage = async (browser, name) => {
  await gotoProfileSearch(browser);

  await browser.$('.search-box input[type="text"]').waitForDisplayed();

  await browser.$('.search-box input[type="text"]').setValue(name);
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();

  await browser.$(`a=${name}`).click();
};

const gotoPIL = async (browser, name) => {
  await gotoProfilePage(browser, name);
  await browser.$('a[href*="/pil/"]').click();
};

export {
  gotoProfileSearch,
  gotoProfilePage,
  gotoPIL
};
