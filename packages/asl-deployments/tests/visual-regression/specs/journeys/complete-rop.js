module.exports = [
  () => {
    browser.withUser('asrusuper');
    browser.$('a=Projects').click();
    browser.$('.search-box input[type="text"]').setValue('Active project');
    browser.$('.search-box button[type="submit"]').click();
    browser.$('a=Active project').click();
    browser.$('a=Reporting').click();
  },
  () => {
    browser.$('button*=Start return').click();
  },
  () => {
    browser.$('a=Continue').click();
  },
  () => {
    browser.$('input[name="proceduresCompleted"][value="true"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="postnatal"][value="true"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="endangered"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="nmbas"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="rodenticide"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="otherSpecies"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="reuse"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="placesOfBirth"][value="uk-licenced"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="ga"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="purposes"][value="basic"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="basicSubpurposes"][value="oncology"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="newGeneticLine"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="productTesting"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('button=Continue to procedures').click();
  },
  () => {
    browser.$('a=Add procedures').click();
  },
  () => {
    browser.$('input[name="severity"][value="mild"]').click();
    browser.$('input[name="mild-severityNum"]').setValue('100');
    browser.$('button=Add procedures').click();
  },
  () => {
    browser.$('a=Submit return').click();
  },
  () => {
    browser.$('a=Continue').click();
  },
  () => {
    browser.$('button=Agree and continue').click();
  },
  () => {
    browser.$('button=Submit now').click();
  }
];
