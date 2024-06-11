module.exports = [
  () => {
    browser.withUser('holc');
    browser.url('/establishments/8201/places');
    browser.$('a=58816').click();
  },
  () => browser.$('a=Amend area').click(),
  () => {
    browser.$('input[name="suitability"][value="SA"]').click();
    browser.$('a=Add').click();
    browser.$('textarea[name="restrictions"]').setValue('Some restrictions');
    browser.$('button=Done').click();
  },
  () => {
    browser.$('button=Continue').click();
    browser.$('input[name="declaration"][value="true"]').click();
  },
  () => {
    browser.$('button=Submit').click();
  },
  () => {
    browser.$('a=track the progress of this request.').click();
  }
];
