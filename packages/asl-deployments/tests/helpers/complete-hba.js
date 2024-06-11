import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function () {
  const filePath = path.join(__dirname, '../public/files/test-hba.docx');
  const remoteFilePath = await this.uploadFile(filePath);

  await this.$('input[name="upload"]').setValue(remoteFilePath);
  await this.$('//button[not(@disabled) and span/text()="Continue"]').waitForDisplayed();
  await this.$('button=Continue').click();

  // This seems to get ECONNREFUSED errors, so retry a few times
  let retries = 3;
  while (
    !await this.$('[name="confirmHba"][value="yes"]').isDisplayed() &&
    await this.$('a=Try again').isDisplayed() &&
    retries-- > 0
  ) {
    await this.pause(1000);
    await this.$('a=Try again').click();
  }

  await this.$('[name="confirmHba"][value="yes"]').click();
  await this.$('button=Continue').click();
}
