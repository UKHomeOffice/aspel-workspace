import assert from 'assert';

export default settings => async function (username, selector = 'h1*=Hello') {
  // eslint-disable-next-line no-param-reassign
  username = username || settings.defaultUser;

  const doLogin = async () => {
    await this.deleteCookies();
    await this.url('/logout');
    await this.$('[name=username]').waitForDisplayed({timeout: 10000});
    await this.$('[name=username]').setValue(username);
    if (!settings.users[username]) {
      console.error(`Could not find user: ${username}`);
    }
    await this.$('[name=password]').setValue(
      settings.users[username] || settings.defaultPassword);
    await this.$('[name=login]').click();
    const errorMessage = await this.$$('.alert-error');
    if (errorMessage.length) {
      const errorText = errorMessage[0].getText();
      assert.fail(`Login error found: ${errorText}`);
    }
    await this.$(selector).waitForDisplayed({timeout: 10000});
  };

  const tryLogin = async (count = 0) => {
    if (count === 3) {
      throw new Error('Login failed 3 times: ' + await browser.getUrl());
    }
    try {
      await doLogin();
    } catch (e) {
      console.error(
        `Login as ${username} to ${await browser.getUrl()} failed with message "${e.message}", retrying (${count + 1}).`);
      await tryLogin(count + 1);
    }
  };

  await tryLogin(0);

};
