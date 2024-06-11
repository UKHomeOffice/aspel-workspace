async function gotoCatESection() {
  await browser.url('/');
  await browser.$('a=Go to Training Establishment').click();
  await browser.$('a=Personal licences').click();
  await browser.$('a=Category E').click();
}
export default gotoCatESection;
