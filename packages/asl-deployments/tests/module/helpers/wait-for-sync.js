import assert from 'assert';

export default async function () {
  await this
    .$('.sync-indicator.syncing')
    .waitForExist({
      timeout: 20000,
      reverse: true
    });
  assert(!await this.$('.alert').isDisplayed(), 'No alert should be displayed following a successful sync');
}
