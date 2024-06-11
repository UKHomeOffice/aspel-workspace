export default async function (imagePath) {
  const file = await browser.uploadFile(imagePath);
  await this.$('input[type="file"]').setValue(file);
  await this.$('img').waitForDisplayed();
}
