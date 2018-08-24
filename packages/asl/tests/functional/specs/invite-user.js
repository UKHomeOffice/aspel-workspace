const assert = require('assert');

describe('Invite user ', () => {

    it('should display a notification message after successful form submit', () => {
        browser.withUser('holc');
        browser.click('=Invite');

        browser.$('#firstName').setValue('Elvin');
        browser.$('#lastName').setValue('Ali');
        browser.$('#email').setValue('elvin.ali@marvel-consulting.com');

        browser.$$('input[type="radio"]')[0].click();

        browser.$('button').click();
        browser.waitForExist('#notification-summary-heading');

        const notification = $('#notification-summary-heading').getText();
        assert.equal(notification, 'Invitation sent to elvin.ali@marvel-consulting.com.');
    });

});