export default function (name, values = []) {
  const el = this.$(`.select-many.${name}`);
  el.$$('a*=Remove').forEach(link => {
    if (link.isDisplayed()) {
      link.click();
    }
  });

  let selects = el.$$(`select[name=${name}]`);

  values.map((value, i) => {
    if (!selects[i]) {
      el.$('button*=Add').click();
      selects = el.$$(`select[name=${name}]`);
    }
    selects[i].selectByVisibleText(value);
  });
}
