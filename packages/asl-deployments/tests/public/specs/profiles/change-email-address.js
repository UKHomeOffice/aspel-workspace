import assert from 'assert';

const gotoChangeEmail = async(browser, name) => {
  await browser.$('header .status-bar').$(`a=${name}`).click();
  await browser.$('a=Email address').click();
};

const changeEmail = async(browser, emailAfter) => {
  await browser.$('input[name=email]').setValue(emailAfter);
  await browser.$('input[name=emailConfirm]').setValue(emailAfter);
  await browser.$('input[name=password]').setValue(process.env.KEYCLOAK_PASSWORD);
  await browser.$('button=Continue').click();
};

const revertToOriginalEmail = async(browser, name, originalEmail) => {
  await gotoChangeEmail(browser, name);
  await changeEmail(browser, originalEmail);
  await browser.$('button=Submit').click();
  assert.equal(await browser.$('h1').getText(), 'Your account', 'user is returned to the account menu');
};

describe('Change email address', () => {
  const name = 'Test Email-change';

  it('validates that required fields are completed', async() => {
    await browser.withUser('email-change-before@example.com');
    await gotoChangeEmail(browser, name);

    await browser.$('button=Continue').click();

    assert(await browser.$('span=Please enter a new email address').isDisplayed(), 'an error message is displayed if the user does not enter a new email address');
    assert(await browser.$('span=Please confirm your new email address').isDisplayed(), 'an error message is displayed if the user does not confirm their new email address');
    assert(await browser.$('span=Please enter your password').isDisplayed(), 'an error message is displayed if the user does enter their password');
  });

  it('validates that the password is correct', async() => {
    const emailBefore = 'email-change-before@example.com';
    const emailAfter = 'email-change-after@example.com';

    await browser.withUser(emailBefore);
    await gotoChangeEmail(browser, name);

    await browser.$('input[name=email]').setValue(emailAfter);
    await browser.$('input[name=emailConfirm]').setValue(emailAfter);
    await browser.$('input[name=password]').setValue('incorrectpassword');
    await browser.$('button=Continue').click();

    assert(await browser.$('span=The password you entered does not match our records').isDisplayed(), 'an error message is displayed if the user inputs the wrong password');
  });

  it('validates that the email is not already in use', async() => {
    const emailBefore = 'email-change-before@example.com';
    const emailInUse = 'basic.user@example.com';

    await browser.withUser(emailBefore);
    await gotoChangeEmail(browser, name);
    await changeEmail(browser, emailInUse);
    await browser.$('button=Submit').click();

    assert(await browser.$('span=This email address is already in use').isDisplayed(), 'an error message is displayed if the email address is already used');
  });

  it('validates that the email is not already in use but with different case', async() => {
    const emailBefore = 'email-change-before@example.com';
    const emailInUse = 'BaSiC.uSeR@example.com';

    await browser.withUser(emailBefore);
    await gotoChangeEmail(browser, name);
    await changeEmail(browser, emailInUse);
    await browser.$('button=Submit').click();

    assert(await browser.$('span=This email address is already in use').isDisplayed(), 'an error message is displayed if the email address is already used');
  });

  it('will allow the user to make a mistake and go back and edit', async() => {
    const emailBefore = 'email-change-before@example.com';
    const wrongEmail = 'wrong@example.com';
    const rightEmail = 'right@example.com';

    await browser.withUser(emailBefore);

    await gotoChangeEmail(browser, name);
    await changeEmail(browser, wrongEmail);

    await browser.$('a=Edit').click();
    assert.equal(await browser.$('h1').getText(), 'Change your email address', 'it takes you back to the change email form');
    assert.equal(await browser.$('input[name=email]').getValue(), wrongEmail, 'the form still displays the entered email');
    assert.equal(await browser.$('input[name=emailConfirm]').getValue(), wrongEmail, 'the form still displays the entered email');
    assert.equal(await browser.$('input[name=password]').getValue(), '', 'the password field is empty and must be re-entered');

    await changeEmail(browser, rightEmail);
    assert(await browser.$(`p=${emailBefore}`).isDisplayed(), 'it displays the current email address');
    assert(await browser.$(`p=${rightEmail}`).isDisplayed(), 'it displays the corrected email address');
  });

  it('will allow the user to change their mind and cancel', async() => {
    const emailBefore = 'email-change-before@example.com';
    const wrongEmail = 'wrong@example.com';

    await browser.withUser(emailBefore);
    await gotoChangeEmail(browser, name);
    await changeEmail(browser, wrongEmail);
    await browser.$('a=Cancel').click();

    assert(await browser.$('h1').getText(), 'Your account', 'user is taken back to the account page');
  });

  it('allows the user to change their email address', async() => {
    const emailBefore = 'email-change-before@example.com';
    const emailAfter = 'email-change-after@example.com';

    await browser.withUser(emailBefore);
    await gotoChangeEmail(browser, name);
    assert.equal(await browser.$('h1').getText(), 'Change your email address', 'it has a descriptive heading');
    assert(await browser.$(`p=${emailBefore}`).isDisplayed(), 'it displays the current email address in the form');

    await changeEmail(browser, emailAfter);
    assert.equal(await browser.$('h1').getText(), 'Confirm changes', 'it takes you to the confirm page');
    assert(await browser.$(`p=${emailBefore}`).isDisplayed(), 'it displays the current email address on the confirm page');
    assert(await browser.$(`p=${emailAfter}`).isDisplayed(), 'it displays the entered email address on the confirm page');

    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('h1').getText(), 'Your account', 'user is returned to the account menu');

    await browser.withUser(emailAfter);
    assert.equal(await browser.$('h1').getText(), 'Hello Test', 'can log in with the new email address');

    await gotoChangeEmail(browser, name);
    assert(await browser.$(`p=${emailAfter}`).isDisplayed(), 'it displays the new email address as the current email address');

    await revertToOriginalEmail(browser, name, emailBefore);
  });

});
