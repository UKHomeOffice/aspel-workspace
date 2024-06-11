module.exports = [
  () => {
    browser.withUser('holc');
    browser.$('h3=University of Croydon').click();
    browser.$('.expanding-panel.open').$('a=Apply for personal licence').click();
  },
  () => {
    browser.$('button=Apply now').click();
  },
  () => {
    browser.$('a=Procedures').click();
  },
  () => {
    browser.$('input[name="procedures"][value="A"]').click();
    browser.$('input[name="procedures"][value="B"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('a=Animal types').click();
  },
  () => {
    browser.$('summary=Small animals').click();
    browser.$('summary=Large animals').click();
    browser.$('input[value="Mice"]').click();
    browser.$('input[value="Cattle"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('a=Training').click();
  },
  () => {
    browser.$('input[name="update"][value="false"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="declaration"][value="true"]').click();
    browser.$('button=Continue').click();
    browser.$('button=Submit to NTCO').click();
  }
];
