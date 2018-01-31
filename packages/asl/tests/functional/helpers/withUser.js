const password = username => {
  const pw = process.env[`ASL_PASSWORD_${username.toUpperCase()}`];
  if (pw) {
    return pw;
  }
  throw new Error(`No password has been defined for user: ${username}`);
}

module.exports = browser => username => {
  browser.url('/logout');
  browser.setValue('[name=username]', username);
  browser.setValue('[name=password]', password(username));
  browser.click('[name=login]');
};
