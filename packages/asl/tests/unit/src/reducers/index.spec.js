const rootReducer = require('src/reducers');

describe('Root Reducer', () => {
  test('creates the expected initial state', () => {
    const expected = {
      establishment: {},
      profile: {},
      list: {
        data: [],
        schema: {}
      },
      sort: {
        column: '',
        ascending: true
      },
      filter: ''
    };
    expect(rootReducer(undefined, {})).toEqual(expected);
  });
});
