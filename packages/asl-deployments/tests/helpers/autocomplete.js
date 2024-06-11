// This autocomplete function is invoked on HTML element
export default async function (value) {
  const letters = value.split('');
  let found = false;
  await this.click();
  while (!found && letters.length) {
    await browser.keys(letters.shift());
    found = await browser.$(`li*=${value}`).isDisplayed();
    await browser.pause(200);
  }
  await browser.$(`li*=${value}`).click();
}
