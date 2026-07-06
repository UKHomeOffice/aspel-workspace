const assert = require('assert');

const normalise = value => value.trim().replace(/\r\n/g, '\n');

const publicTaskUrl = (publicUrl, taskId) => `${publicUrl}/tasks/${taskId}?notification=${taskId}`;

const renderExpectedEmail = ({ recipientName, body }) => normalise(`Hello ${recipientName}

${body}


Many thanks,
Animals in Science Regulation Unit

(This is an automated email. Please do not reply.)`);

const formatLoggedEmail = ({ title, label, content }) => {
  const numberedLines = normalise(content)
    .split('\n')
    .map((line, index) => `${String(index + 1).padStart(2, ' ')} | ${line}`)
    .join('\n');

  return [
    `----- [${title}] ${label} START -----`,
    numberedLines,
    `----- [${title}] ${label} END -----`
  ].join('\n');
};

// Developer note:
// Set enabled to true for a single test when you want to compare the rendered
// email with the expected email in test output. Leave it false for normal runs.
const logEmailComparison = ({ enabled = false, title, actual, expected }) => {
  if (!enabled) {
    return;
  }

  console.log(`\n${formatLoggedEmail({ title, label: 'actual email', content: actual })}`);
  console.log(`\n${formatLoggedEmail({ title, label: 'expected email', content: expected })}`);
};

const assertNormalisedOutput = ({ actual, expected, debugEmail = false, title }) => {
  const normalisedActual = normalise(actual);
  const normalisedExpected = normalise(expected);

  logEmailComparison({
    enabled: debugEmail,
    title,
    actual: normalisedActual,
    expected: normalisedExpected
  });

  assert.equal(normalisedActual, normalisedExpected);
};

module.exports = {
  assertNormalisedOutput,
  logEmailComparison,
  normalise,
  publicTaskUrl,
  renderExpectedEmail
};
