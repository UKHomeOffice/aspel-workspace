const rootReducer = require('src/reducers');

describe('Root Reducer', () => {
  test('creates the expected initial state', () => {
    const expected = {
      establishment: {},
      list: {
        all: [],
        filtered: [],
        filter: ''
      }
    };
    expect(rootReducer(undefined, {})).toEqual(expected);
  });
});
