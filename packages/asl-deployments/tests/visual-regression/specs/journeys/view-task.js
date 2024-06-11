module.exports = [
  () => {
    browser.withUser('inspector');
    browser.$('a=Outstanding').click();
    browser.$('a=PPL application').click();
  }
];
