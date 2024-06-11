export default function async (options) {
  this.waitUntil(async () => {
    if (await this.$('.govuk-panel.success').isDisplayed()) {
      return true;
    }
    if (await this.$('.alert:not(.alert-error)').isDisplayed()) {
      return true;
    }
    return false;
  }, options);
}
