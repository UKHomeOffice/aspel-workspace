import assert from 'assert';

const originalPassword = process.env.KEYCLOAK_PASSWORD;
const newPassword = 'Password123';
const testUser = 'password-change@example.com';

const gotoChangePassword = async(browser, name) => {
  await browser.$('header .status-bar').$(`a=${name}`).click();
  await browser.$('a=Password').click();
};

const changePassword = async(browser, passwordBefore, passwordAfter) => {
  await browser.$('input[name=oldPassword]').setValue(passwordBefore);
  await browser.$('input[name=password]').setValue(passwordAfter);
  await browser.$('input[name=passwordConfirm]').setValue(passwordAfter);
  await browser.$('button=Change password').click();
};

const revertToOriginalPassword = async(browser, name) => {
  await gotoChangePassword(browser, name);
  await changePassword(browser, newPassword, originalPassword);
  await browser.waitForSuccess();
  assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Password changed');
};

const login = async(browser, username, password) => {
  await browser.$('[name=username]').waitForDisplayed({ timeout: 10000 });
  await browser.$('[name=username]').setValue(username);
  await browser.$('[name=password]').setValue(password);
  await browser.$('[name=login]').click();
};

describe('Change password', () => {
  const name = 'Test Password-change';

  it('validates that required fields are completed', async() => {
    await browser.withUser(testUser);
    await gotoChangePassword(browser, name);

    await browser.$('button=Change password').click();

    assert(await browser.$('span=Please enter your password').isDisplayed(), 'an error message is displayed if the user does not enter their existing password');
    assert(await browser.$('span=Please enter a new password').isDisplayed(), 'an error message is displayed if the user does not enter a new password');
    assert(await browser.$('span=Please confirm your new password').isDisplayed(), 'an error message is displayed if the user does not confirm their new password');
  });

  it('validates that the existing password is correct', async() => {
    await browser.withUser(testUser);
    await gotoChangePassword(browser, name);

    await browser.$('input[name=oldPassword]').setValue('foo');
    await browser.$('input[name=password]').setValue(newPassword);
    await browser.$('input[name=passwordConfirm]').setValue(newPassword);
    await browser.$('button=Change password').click();

    assert(await browser.$('span=The password you entered does not match our records').isDisplayed(), 'an error message is displayed if the user inputs the wrong existing password');
  });

  it('validates that the new password conforms to the password strength rules', async() => {
    await browser.withUser(testUser);
    await gotoChangePassword(browser, name);

    await browser.$('input[name=oldPassword]').setValue(originalPassword);
    await browser.$('input[name=password]').setValue('foo');
    await browser.$('input[name=passwordConfirm]').setValue('foo');
    await browser.$('button=Change password').click();

    assert(await browser.$('span=Your password must match the requirements above').isDisplayed(), 'an error message is displayed if the user inputs an invalid password');
  });

  it('allows the user to change their password', async() => {
    await browser.withUser(testUser);
    await gotoChangePassword(browser, name);

    assert.equal(await browser.$('h1').getText(), 'Change your password', 'it has a descriptive heading');

    await changePassword(browser, originalPassword, newPassword);
    await browser.waitForSuccess();
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Password changed');

    await browser.url('/');
    assert.ok(await browser.$('h1=Sign in to your account').isDisplayed());

    await login(browser, testUser, originalPassword);
    const errorText = await browser.$('#input-error').getText();
    assert.equal(errorText, 'Invalid username or password.');

    await login(browser, testUser, newPassword);
    await browser.$('h1=Hello Test').waitForDisplayed({ timeout: 10000 });

    await revertToOriginalPassword(browser, name);
    await browser.withUser(testUser);
  });

});
