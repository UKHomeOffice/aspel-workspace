import Runner from 'mocha';

const _runSuite = Runner.prototype.runSuite;
Runner.prototype.runSuite = function (suite, fn) {

  // only sample the top `describe` in each file
  if (process.env.SAMPLE_TESTS && suite.parent && !suite.parent.parent) {
    const sample = parseFloat(process.env.SAMPLE_TESTS);
    if (Math.random() > sample) {
      suite.pending = true;
      suite.eachTest(test => {
        test.pending = true;
      });
    }
  }
  return _runSuite.call(this, suite, fn);
};
