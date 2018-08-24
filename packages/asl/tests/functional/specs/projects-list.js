const assert = require('assert');

describe('Projects directory', () => {

    it('will filter by project title', () => {
        browser.withUser('holc');
        browser.click('a[href*="/e/8201').click('=Projects');

        browser.$('.search-box input[type="text"]').setValue('anti-cancer');
        browser.$('.search-box button').click();

        browser.waitForExist('table:not(.loading)');

        const projects = browser.$$('tbody tr td:nth-child(0)')
            .map(td => browser.elementIdText(td.ELEMENT).value);

        projects.forEach(project => assert.ok(project.toLowerCase().includes('anti-cancer')));
    });

    it('will filter by license holder', () => {
        browser.withUser('holc');
        browser.click('a[href*="/e/8201').click('=Projects');

        browser.$('.search-box input[type="text"]').setValue('br');
        browser.$('.search-box button').click();

        browser.waitForExist('table:not(.loading)');

        const holders = browser.$$('tbody tr td:nth-child(2)')
            .map(td => browser.elementIdText(td.ELEMENT).value);

        holders.forEach(holder => assert.ok(holder.toLowerCase().includes('br')));
    });

});
