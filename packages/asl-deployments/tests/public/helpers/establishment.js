const gotoEstablishment = async (browser, establishmentName = 'University of Croydon') => {
  await browser.url('/');
  const panel = await browser.$(`//*[@class='panel-list']//h3[text()="${establishmentName}"]/ancestor::section[starts-with(@class, "expanding-panel")]`);
  const panelClass = await panel.getAttribute('class');
  if (!panelClass.includes('open')) {
    await panel.$(`h3*=${establishmentName}`).click();
  }
  await panel.$(`a=Go to ${establishmentName}`).click();
  await browser.$('h1=Establishment overview').waitForExist();
};

export {
  gotoEstablishment
};
