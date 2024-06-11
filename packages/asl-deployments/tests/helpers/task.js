export const findTask = async (browser, selector, { retry = true, gotoStart = true } = {}) => {
  await (await browser.$('table:not(.loading)')).waitForExist();

  // if we're not on the first page then go back to page 1
  if (gotoStart && await (await browser.$('.tasklist .pagination a.prev:not(.current)')).isDisplayed()) {
    if (await (await (await browser.$('.tasklist .pagination')).$('a=1')).isDisplayed()) {
      await (await (await browser.$('.tasklist .pagination')).$('a=1')).click();
    } else {
      await (await browser.$('.tasklist .pagination a.prev')).click();
    }
    await (await browser.$('table:not(.loading)')).waitForExist();
    return findTask(browser, selector, { retry, gotoStart: true });
  }

  if (await (await browser.$(selector)).isDisplayed()) {
    return browser.$(selector);
  }

  if (await (await browser.$('.tasklist .pagination a.next:not(.current)')).isDisplayed()) {
    await (await browser.$('.tasklist .pagination a.next')).click();
    await (await browser.$('table:not(.loading)')).waitForExist();
    return findTask(browser, selector, { retry, gotoStart: false });
  }

  if (retry) {
    console.log(`Retrying findTask for selector ${selector}`);
    return findTask(browser, selector, { retry: false, gotoStart: true });
  }

  throw new Error(`Could not find task with selector: ${selector}`);
};

export const searchForTask = async (searchTerm) => {
  await browser.url('/');
  await browser.$('a=Search all tasks').click();
  await browser.$('.search-box input[type="text"]').setValue(searchTerm);
  await browser.$('.search-box button').click();
  await browser.$('table:not(.loading)').waitForExist();
};
