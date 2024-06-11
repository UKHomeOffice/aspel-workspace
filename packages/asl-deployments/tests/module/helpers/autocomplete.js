// This autocomplete function is invoked on WDIO browser object
export default async function (name, value) {
  const el = await this.$(`#${name}`);
  await el.clearValue();
  await el.click();
  await browser.keys(value);

  const listBox = await this.$(`#${name}__listbox`);
  const line = await listBox.$(`li*=${value}`);
  await line.click();
}
