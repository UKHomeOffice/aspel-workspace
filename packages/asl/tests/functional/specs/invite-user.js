const assert = require("assert");

describe("Invite user", () => {

    it("will display a notification message after successful form submit", () => {
        browser.withUser("holc");
        browser.click("*=Invite");

        browser.setValue("#firstName", "Elvin");
        browser.setValue("#lastName", "Ali");
        browser.setValue("#email", "elvin.ali@marvel-consulting.com");
        browser.$("label[for='role-admin']").click();

        browser.$("button*=Send invitation").click();
        browser.waitForExist("#notification-summary-heading");

        const notification = browser.$("#notification-summary-heading").getText();
        assert.equal(notification, "Invitation sent to elvin.ali@marvel-consulting.com.");
    });

});