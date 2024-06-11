const completeRichTextField = async(browser, name, text) => {
  await browser.$(`#${name}`).click();
  await browser.keys(text);
  await browser.$(`span=${text}`).waitForDisplayed();
  await browser.waitForSync();
};

const completeSection = async browser => {
  await browser.$('button=Continue').click();
  await browser.$('label=This section is complete').click();
  await browser.$('button=Continue').click();
};

const completeRA = async browser => {
  // complete application
  await browser.$('a=Project aims').click();
  await browser.$('label=No').click();

  await completeRichTextField(browser, 'aims-achieved', 'I am told the aims were achieved');
  await completeSection(browser);

  await browser.$('a=Harms').click();

  await completeRichTextField(browser, 'actual-harms', 'The pigs had a headache.');
  await completeSection(browser);

  await browser.$('a=Replacement').click();

  await completeRichTextField(browser, 'replacement', 'Spinach can send emails now.');
  await completeSection(browser);

  await browser.$('a=Reduction').click();

  await completeRichTextField(browser, 'reduction', 'If you use one really fat mouse its the same as using two.');
  await completeSection(browser);

  await browser.$('a=Refinement').click();

  await completeRichTextField(browser, 'refinement', 'Science is 10% sciencier.');
  await completeSection(browser);

  await browser.waitForSync();
};

export {
  completeRichTextField,
  completeSection,
  completeRA
};
