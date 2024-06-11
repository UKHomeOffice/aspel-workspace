// const WDIOReporter = require('@wdio/reporter').default;
import { default as WDIOReporter } from '@wdio/reporter';
import chalk from 'chalk';
class Reporter extends WDIOReporter {

  write(msg = '') {
    super.write(`${msg}\n`);
  }

  divider() {
    this.write('--------------------------------------');
  }

  onRunnerEnd(runner) {
    const slow = runner.config.slow || 30000;
    if (runner.failures || (runner._duration > slow)) {
      this.write(chalk.blue.underline(runner.specs[0]));
    }
    if (runner._duration > slow) {
      this.write(`${chalk.yellow('WARNING: ')} completed in ${Math.round(runner._duration / 1000)}s`);
      this.write();
    }
    if (runner.failures) {
      this.write();
      Object.values(this.suites).forEach(suite => {
        [...suite.tests, ...suite.hooks].forEach(test => {
          if (test.state === 'failed') {
            return this.reportFailedTest(test);
          }
        });
      });
      this.write();
    }
  }

  getTitle(test) {
    switch (test.type) {
      case 'test':
        return `"${test.fullTitle}"`;
      case 'hook':
        return `${test.title} for "${test.parent}"`;
    }
  }

  reportFailedTest(test) {
    const title = this.getTitle(test);
    this.write(chalk.red(`FAILED: ${title} failed:`));
    this.write(test.error.stack);
    this.write();
    if (test.error.expected || test.error.actual) {
      this.divider();
      this.write(`    Expected: ${test.error.expected}`);
      this.write(`    Actual:   ${test.error.actual}`);
      this.divider();
      this.write();
    }
  }

}

export default Reporter;
