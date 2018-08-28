const assert = require('assert');

describe('Create approved area', () => {

    it('will display a notification message after successful form submit', () => {
        browser.withUser('holc');
        browser.click('a[href*="/e/8201').click('=Licensed premises').click('a[href*="/e/8201/places/create');

        browser.$('#site').setValue('site');
        browser.$('#area').setValue('area');
        browser.$('#name').setValue('name');
        browser.$$('#suitability .multiple-choice label')[0].click();
        browser.$$('#holding .multiple-choice label')[0].click();
        browser.$$('#nacwo option')[1].click();
        browser.$('#comments').setValue('test');
        browser.click('button*=Submit');

        const title = browser.getText('h1');
        assert.equal(title, 'Confirm addition');
        const expected = ['University of Croydon', 'XCC09J64D', 'Leonard Martin', 'site', 'area', 'name', 'SA', 'STH', 'Ian Ayers'];
        assert(browser.$$('dl dd').every(elem => expected.indexOf(elem.getText()) > -1));
        assert.equal(browser.getText('.field p'), 'test');

        console.log('declaration is ', browser.$("label[for='declaration-true']").getText());
        browser.$('label[for="declaration-true"]').click();
        browser.click('button*=Submit');

        browser.waitForExist('.heading-xlarge');

        const notification = $('.heading-xlarge').getText();
        console.log('Notification is ', notification);
        assert.equal(notification, 'Your changes have been submitted');
    });

    it('will display creation form on edit', () => {
        browser.withUser('holc');
        browser.click('a[href*="/e/8201').click('=Licensed premises').click('a[href*="/e/8201/places/create');

        browser.$('#site').setValue('site');
        browser.$('#area').setValue('area');
        browser.$('#name').setValue('name');
        browser.$$('#suitability .multiple-choice label')[0].click();
        browser.$$('#holding .multiple-choice label')[0].click();
        browser.$$('#nacwo option')[1].click()
        browser.$('#comments').setValue('test');
        browser.click('button=Submit');
        browser.click('a[href*="?edit=true');

        assert.equal(browser.$('#site').getValue(), 'site');
        assert.equal(browser.$('#area').getValue(), 'area');
        assert.equal(browser.$('#name').getValue(), 'name');
        const expected = ['SA', 'STH'];
        assert(browser.$$('input:checked').every(elem => expected.indexOf(elem.getValue()) > -1));
        assert.equal(browser.$('#nacwo').getValue(),'c462d73a-d7a3-44ed-9464-7ce9d4779c4d');

    });
});
