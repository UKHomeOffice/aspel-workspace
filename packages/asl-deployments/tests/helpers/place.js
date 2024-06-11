const applySiteFilter = async (browser, site) => {
  if (!await browser.$('.filters').isDisplayed()) {
    await browser.$('a=Filter areas').click();
  }
  await browser.$('#site-label').click();
  await browser.$(`label=${site}`).click();
  await browser.$('button=Apply filters').click();

  await browser.$('table:not(.loading)').waitForExist();
};

const selectNacwos = async (browser, names = []) => {
  let selects = await browser.$$('select[name=nacwos]');

  await Promise.all(names.map(async(name, i) => {
    if (!selects[i]) {
      await browser.$('button=Add NACWO').click();
      selects = await browser.$$('select[name=nacwos]');
    }
    await selects[i].selectByVisibleText(name);
  }));
};

const selectNVSSQPs = async(browser, names = []) => {
  let selects = await browser.$$('select[name=nvssqps]');

  await Promise.all(names.map(async(name, i) => {
    if (!selects[i]) {
      await browser.$('button=Add NVS / SQP').click();
      selects = await browser.$$('select[name=nvssqps]');
    }
    await selects[i].selectByVisibleText(name);
  }));
};

export {
  applySiteFilter,
  selectNacwos,
  selectNVSSQPs
};
