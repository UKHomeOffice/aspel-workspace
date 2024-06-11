module.exports = [
  () => {
    browser.withUser('holc');
    browser.$('h3=University of Croydon').click();
    browser.$('a=Go to University of Croydon').click();
    browser.$('a=Projects').click();
    browser.$('input[name="filter"]').setValue('Active project');
    browser.$('.search-box').$('button[type="submit"]').click();
    browser.$('table:not(.loading)').waitForExist();
    browser.$('a=Active project').click();
    browser.$('a=View licence').click();
  },
  () => browser.$('a=Conditions').click(),
  () => browser.$('a=Action plan').click(),
  () => {
    browser.$('a=Protocols').click();
    browser.$('.protocol .header').click();
    browser.$('a=Open all sections').click();
  }
];
