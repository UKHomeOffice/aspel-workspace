export default async function (establishment = 'University of Croydon') {
  await this.url('/');

  if (await this.$('.expanding-panel.open').isDisplayed()) {
    return this.$('.expanding-panel.open').$(`a=Go to ${establishment}`).click();
  }

  await this.$('.panel-list').$(`h3=${establishment}`).click();
  await this.$('.expanding-panel.open').$(`a=Go to ${establishment}`).click();
}
