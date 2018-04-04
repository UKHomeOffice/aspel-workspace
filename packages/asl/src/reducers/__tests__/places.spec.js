const all = require('../places');
const { filterData, searchData } = all;

const getFilters = ({ site = [], suitability = [], holding = [] } = {}) => ({
  site,
  suitability,
  holding
});

describe('Places Reducer', () => {
  describe('all', () => {
    test('returns an empty array when initialised without state', () => {
      expect(all(undefined, {})).toEqual([]);
    });

    test('returns all data when initialised with state', () => {
      const state = [{ a: 1 }, { b: 2 }, { c: 3 }];
      expect(all(state, {})).toBe(state);
    });
  });

  describe('filterData()', () => {
    let rows;

    beforeEach(() => {
      rows = [
        { site: 'Site A', suitability: ['AB', 'CD'], holding: ['AB'] },
        { site: 'Site B', suitability: ['CD'], holding: ['CD', 'EF'] },
        { site: 'Site C', suitability: ['EF', 'GH'], holding: ['CD'] }
      ];
    });

    test('returns the unfiltered rows if no filters are given', () => {
      const filters = getFilters();
      expect(filterData(rows, filters)).toBe(rows);
    });

    test('matches a single site', () => {
      const filters = getFilters({ site: ['Site A'] });
      expect(filterData(rows, filters)).toMatchObject([
        { site: 'Site A' }
      ]);
    });

    test('matches multiple sites', () => {
      const filters = getFilters({ site: ['Site A', 'Site C'] });
      expect(filterData(rows, filters)).toMatchObject([
        { site: 'Site A' },
        { site: 'Site C' }
      ]);
    });
  });
});
