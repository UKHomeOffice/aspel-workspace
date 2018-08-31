const assert = require("assert");

describe("Create approved area", () => {
  it("will display a notification message after successful form submit", () => {
    const expected = [
      "University of Croydon",
      "XCC09J64D",
      "Leonard Martin",
      "site",
      "area",
      "name",
      "SA",
      "STH",
      "Ian Ayers"
    ];

    browser.withUser("holc");
    browser
      .click("a=University of Croydon")
      .click("a=Licensed premises")
      .click("a*=Create");
    browser.$("input[name=site]").setValue("site");
    browser.$("input[name=area]").setValue("area");
    browser.$("input[name=name]").setValue("name");
    browser
      .$$("#suitability .multiple-choice label")
      .find(opt => {
        return opt.getText().indexOf("SA") > -1;
      })
      .click();
    browser
      .$$("#holding .multiple-choice label")
      .find(opt => {
        return opt.getText().indexOf("STH") > -1;
      })
      .click();
    browser
      .$$("#nacwo option")
      .find(opt => {
        return opt.getText() === "Ian Ayers";
      })
      .click();
    browser.$("textarea[name=comments]").setValue("test");
    browser.click("button*=Submit");

    assert.equal(browser.getText("h1"), "Confirm addition");
    assert(
      browser.$$("dl dd").every(elem => expected.indexOf(elem.getText()) > -1)
    );
    assert.equal(browser.getText(".field p"), "test");

    browser.$('label[for="declaration-true"]').click();
    browser.click("button*=Submit");
    browser.waitForExist(".heading-xlarge");

    assert.equal(
      $(".heading-xlarge").getText(),
      "Your changes have been submitted"
    );
  });

  it("will display creation form on edit", () => {
    const expected = ["SA", "STH"];
    browser.withUser("holc");
    browser
      .click("a=University of Croydon")
      .click("a=Licensed premises")
      .click("a*=Create");
      browser.$("input[name=site]").setValue("site");
      browser.$("input[name=area]").setValue("area");
      browser.$("input[name=name]").setValue("name");
    browser
      .$$("#suitability .multiple-choice label")
      .find(opt => {
        return opt.getText().indexOf("SA") > -1;
      })
      .click();
    browser
      .$$("#holding .multiple-choice label")
      .find(opt => {
        return opt.getText().indexOf("STH") > -1; //opt.getText() === "STH";
      })
      .click();
    browser
      .$$("#nacwo option")
      .find(opt => {
        return opt.getText() === "Ian Ayers";
      })
      .click();
    browser.$("textarea[name=comments]").setValue("test");
    browser.click("button=Submit");
    browser.click("a=Edit");

    assert.equal(browser.$("input[name=site]").getValue(), "site");
    assert.equal(browser.$("input[name=area]").getValue(), "area");
    assert.equal(browser.$("input[name=name]").getValue(), "name");
    assert(
      browser
        .$$("input:checked")
        .every(elem => expected.indexOf(elem.getValue()) > -1)
    );
    assert.equal(
      browser
        .$$("#nacwo option")
        .find(opt => {
          if (opt.getAttribute("selected"))
            return opt.getAttribute("selected") === "true";
        })
        .getText(),
      "Ian Ayers"
    );
  });
});
