const rootReducer = require('src/reducers');

describe('Root Reducer', () => {
  test('creates the expected initial state', () => {
    const expected = {
      establishment: {},
      profile: {},
      list: {
        all: [],
        filtered: [],
        filter: ''
      }
    };
    expect(rootReducer(undefined, {})).toEqual(expected);
  });
});
