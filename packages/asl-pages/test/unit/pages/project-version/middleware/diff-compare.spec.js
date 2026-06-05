const compare = require('../../../../../pages/project-version/middleware/diff/compare');

const toRichText = (...strings) => ({
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: strings.map(text => ({
      object: 'block',
      type: 'paragraph',
      data: {},
      nodes: [
        {
          object: 'text',
          text,
          marks: []
        }
      ]
    }))
  }
});

describe('project version diff compare', () => {
  it('treats paragraph values as rich text for comparison', () => {
    const before = toRichText('hello world, I am new');
    const after = toRichText('hello world, I am amended');

    const result = compare(before, after, { type: 'paragraph' });

    expect(result.added.length).toBeGreaterThan(0);
    expect(result.removed.length).toBeGreaterThan(0);
    expect(result.added.some(part => part.value.includes('amended'))).toBe(true);
    expect(result.removed.some(part => part.value.includes('new'))).toBe(true);
  });
});
