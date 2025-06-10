// eslint-disable-next-line implicit-dependencies/no-implicit
require('@testing-library/jest-dom');

// TextEncoder and TextDecoder are not available in jsdom by default,
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// setImmediate is not available in jsdom by default,
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
