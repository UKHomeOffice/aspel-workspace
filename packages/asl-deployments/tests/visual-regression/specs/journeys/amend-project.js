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
  },
  () => {
    browser.$('a=Manage licence').click();
    browser.$('button=Amend licence').click();
  },
  () => browser.$('a=Introductory details').click()
];
