const initialState = require('src/helpers/initial-state');

describe('Initial State Helper', () => {
  test('doesn\'t throw if called with empty objects', () => {
    expect(() => {
      initialState({}, {});
    }).not.toThrow();
  });

  test('returns an object with expected structure', () => {
    const expected = {
      filters: {
        filterBy: {
          site: [],
          suitability: [],
          holding: []
        },
        textFilter: ''
      },
      pdf: false
    };
    expect(initialState()).toEqual(expected);
  });

  test('adds filters to the returned object', () => {
    const filterBy = {
      site: ['A Site']
    };
    const expected = {
      filters: {
        filterBy: {
          site: ['A Site']
        }
      }
    };
    expect(initialState(undefined, { filterBy })).toMatchObject(expected);
  });

  test('performs a deep merge so unfiltered properties still exist', () => {
    const filterBy = {
      site: ['A Site']
    };
    const expected = {
      filters: {
        filterBy: {
          holding: [],
          suitability: []
        }
      }
    };
    expect(initialState(undefined, { filterBy })).toMatchObject(expected);
  });

  test('adds all filters to returned object', () => {
    const filterBy = {
      site: ['A Site', 'Another Site'],
      suitability: ['AA', 'BB'],
      holding: ['BB', 'CC']
    };
    const expected = {
      filters: {
        filterBy: {
          site: filterBy.site,
          holding: filterBy.holding,
          suitability: filterBy.suitability
        }
      }
    };
    expect(initialState(undefined, { filterBy })).toMatchObject(expected);
  });

  test('sets text filter to the value provided', () => {
    const textFilter = 'A Filter';
    const expected = { filters: { textFilter } };
    expect(initialState(undefined, { textFilter })).toMatchObject(expected);
  });

  test('sets pdf to the value provided', () => {
    const pdf = true;
    const expected = { pdf };
    expect(initialState(undefined, { pdf })).toMatchObject(expected);
  });
});
