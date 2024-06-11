import filenamify from 'filenamify';

export default async function (test, context, state) {
  // if test passed, ignore, else take and save screenshot.
  if (state.passed) {
    return;
  }

  const filename = filenamify(`${test.parent}-${test.title}`);
  await browser.saveScreen(`${filename}-screen`);
  await browser.setWindowSize(1260, 800);
  await browser.saveFullPageScreen(`${filename}-full`);
}
