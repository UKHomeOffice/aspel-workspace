export const closest = () => async function (selector) {
  const elements = await browser.$$(selector);
  const parent = await this.parentElement();
  if (!elements.length) {
    return browser.$(selector);
  }
  if (!await parent.isExisting()) {
    return parent;
  }
  if (await elements.find(e => e.isEqual(parent))) {
    return parent;
  }
  return parent.closest(selector);
};
