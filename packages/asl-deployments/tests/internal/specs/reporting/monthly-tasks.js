import assert from 'assert';

describe('monthly report', function() {

  it('has a download link available', async () => {
    await browser.withUser('inspector');
    const olderReportsSelector = 'summary=Older reports';

    const downloadLinkSelector = '//a[contains(span/text(),"Tasks processed by duration and decision for December 2021")]';
    // wait for the cron job to run and generate the report
    let retries = 5;
    while (true) {
      await browser.url('/downloads');
      if (await browser.$(olderReportsSelector).isDisplayed()) {
        await browser.$(olderReportsSelector).click();
        if (await browser.$(downloadLinkSelector).isDisplayed()) {
          break;
        }
      }

      if (retries-- === 0) {
        break;
      }

      // Sleep for 1 minute
      await new Promise(resolve => setTimeout(resolve, 60_000));
    }

    assert.ok(
      await browser.$(downloadLinkSelector).isDisplayed(),
      'Download link "Tasks processed by duration and decision for December 2021" is not displayed after 5 minutes'
    );
  });

});
