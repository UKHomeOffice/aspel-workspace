import { normaliseValue } from '../../../client/helpers/normalisation';
const assert = require('assert');

describe('normaliseValue', () => {
  it('returns empty string for null or undefined', () => {
    assert.strictEqual(normaliseValue(null), '');
    assert.strictEqual(normaliseValue(undefined), '');
  });

  it('normalises a simple string', () => {
    assert.strictEqual(normaliseValue('  Hello world  '), 'Hello world');
  });

  it('collapses multiple spaces inside a string', () => {
    assert.strictEqual(normaliseValue('  Hello     world   from   ASPeL  '), 'Hello world from ASPeL');
  });

  it('normalises an object using json-stable-stringify', () => {
    const obj = { b: 2, a: 1 };
    assert.strictEqual(normaliseValue(obj), '{"a":1,"b":2}');
  });

  it('normalises a Slate.js rich text object', () => {
    const richText = {
      document: {
        nodes: [
          { object: 'block', nodes: [{ object: 'text', text: 'Hello' }] },
          { object: 'block', nodes: [{ object: 'text', text: 'World' }] }
        ]
      }
    };
    assert.strictEqual(normaliseValue(richText), 'Hello\nWorld');
  });

  it('converts numbers and booleans to string', () => {
    assert.strictEqual(normaliseValue(123), '123');
    assert.strictEqual(normaliseValue(true), 'true');
  });
});
