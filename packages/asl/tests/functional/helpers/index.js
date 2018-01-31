module.exports = browser => {

  browser.addCommand('withUser', require('./withUser')(browser));

  return browser;
}