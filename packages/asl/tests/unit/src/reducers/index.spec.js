const rootReducer = require('src/reducers');

describe('Rooot Reducer', () => {
  test('creates the expected initial state', () => {
    const expected = {
      establishment: {},
      filters: {
        filterBy: {
          site: [],
          suitability: [],
          holding: []
        },
        textFilter: ''
      },
      pdf: false,
      places: []
    };
    expect(rootReducer(undefined, {})).toEqual(expected);
  });
});
