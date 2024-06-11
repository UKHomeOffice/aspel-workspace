import assert from 'assert';

describe('Edit profile', () => {

  it('can access profile edit form', async () => {

    await browser.withUser('inspector2');
    await browser
      .$('header .status-bar')
      .$('a=Inspector Gadget')
      .click();
    await browser
      .$('a=Personal details')
      .click();

    await browser.$('input[name=firstName]').setValue('The');
    await browser.$('input[name=lastName]').setValue('Hulk');
    await browser.$('button*=Submit').click();

    assert.ok(browser.$('.alert:not(.alert-error)').isDisplayed());

    let name = await browser.$('header .status-bar a[href="/account"]').getText();
    assert.equal(name, 'The Hulk');

    await browser.$('input[name=firstName]').setValue('Inspector');
    await browser.$('input[name=lastName]').setValue('Gadget');
    await browser.$('button*=Submit').click();

    await browser.waitForSuccess();

    name = await browser.$('header .status-bar a[href="/account"]').getText();
    assert.equal(name, 'Inspector Gadget');

  });

});
