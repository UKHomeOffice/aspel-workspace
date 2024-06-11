export default (type = 'Outstanding') => async function () {
  const latestLabel = type === 'Completed' ? 'Completed' : 'Last changed';
  await (await this.$('a=In progress')).click();
  await this.waitUntil(async () => {
    if (await this.$('table:not(.loading)').isDisplayed()) {
      return true;
    }
    if (await this.$('p=You have no tasks in progress').isDisplayed()) {
      return true;
    }
    return false;
  });
  (await this.$(`a=${type}`)).click();
  await this.$('table:not(.loading) th a:not(.disabled)').waitForExist();
  if (await this.$(`th=${latestLabel}`).getAttribute('aria-sort') === 'ascending') {
    await (await (await this.$('th')).$(`a=${latestLabel}`)).click();
    await this.$('table:not(.loading)').waitForExist();
  }
};
