const assert = require('assert');

const normalise = value => value.trim().replace(/\r\n/g, '\n');

const publicTaskUrl = (publicUrl, taskId) => `${publicUrl}/tasks/${taskId}?notification=${taskId}`;

const renderExpectedEmail = ({ recipientName, body }) => normalise(`Hello ${recipientName}

${body}


Many thanks,
Animals in Science Regulation Unit

(This is an automated email. Please do not reply.)`);

// Developer note:
// Set enabled to true for a single test when you want to compare the rendered
// email with the expected email in test output. Leave it false for normal runs.
const logEmailComparison = ({ enabled = false, title, actual, expected }) => {
  if (!enabled) {
    return;
  }

  console.log(`\n[${title}] actual email\n${actual}`);
  console.log(`\n[${title}] expected email\n${expected}`);
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
