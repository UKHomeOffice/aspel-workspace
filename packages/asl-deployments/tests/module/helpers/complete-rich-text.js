export default async function (value) {
  await this.click();
  await browser.keys(value);
}
