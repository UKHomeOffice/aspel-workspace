import assert from 'assert';

const gotoEditDetails = async(browser, name) => {
  await browser
    .$('header .status-bar')
    .$(`a=${name}`)
    .click();
  await browser
    .$('a=Personal details')
    .click();
};

describe('Edit profile', () => {

  it('can access profile edit form', async() => {

    await browser.withUser('read');
    await gotoEditDetails(browser, 'Read Only');

    await browser.$('input[name=firstName]').setValue('The');
    await browser.$('input[name=lastName]').setValue('Hulk');
    await browser.$('button*=Submit').click();

    assert.ok(await browser.$('.alert:not(.alert-error)').isDisplayed());

    assert.ok(await browser.$('header .status-bar').$('a=The Hulk').isDisplayed());

    await browser.$('input[name=firstName]').setValue('Read');
    await browser.$('input[name=lastName]').setValue('Only');
    await browser.$('button*=Submit').click();

    await browser.waitForSuccess();

    assert.ok(await browser.$('header .status-bar').$('a=Read Only').isDisplayed());
  });

  it('new users without dates of birth can access profile edit form - bugfix', async() => {

    await browser.withUser('newuser');
    await gotoEditDetails(browser, 'Eve Adams');

    assert.ok(await browser.$('h1=Edit your details').isDisplayed(), 'No error message should display');

  });

  it('user can edit a profile change to not require review - bugfix', async() => {

    await browser.withUser('ntco');
    await gotoEditDetails(browser, 'Neil Down');

    await browser.$('input[name=firstName]').setValue('Changed');
    await browser.$('input[name=dob-day]').setValue('01');
    await browser.$('input[name=dob-month]').setValue('01');
    await browser.$('input[name=dob-year]').setValue('1990');
    await browser.$('button*=Submit').click();
    await browser.waitForSuccess();
    await browser.$('a=Home').click();
    await browser.$('a=In progress').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('a=Profile amendment').click();

    await browser.$('label*=Recall amendment').click();
    await browser.$('button*=Submit').click();

    await browser.$('button*=Recall amendment').click();
    await browser.waitForSuccess();
    await gotoEditDetails(browser, 'Neil Down');

    await browser.$('input[name=firstName]').setValue('Neil');
    await browser.$('button*=Submit').click();

    await browser.$('button*=Edit and resubmit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Profile amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });

});
