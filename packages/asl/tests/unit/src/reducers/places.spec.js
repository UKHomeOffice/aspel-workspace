const all = require('src/reducers/places');
const rows = require('./places.fixture');

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

    test('matches all results containing given suitability', () => {
      const filters = getFilters({ suitability: ['CD'] });
      expect(filterData(rows, filters)).toMatchObject([
        { site: 'Site A' },
        { site: 'Site B' }
      ]);
    });

    test('matches only results containing all given suitabilities', () => {
      const filters = getFilters({ suitability: ['AB', 'CD'] });
      expect(filterData(rows, filters)).toMatchObject([
        { site: 'Site A' }
      ]);
    });

    test('matches all results containing given holding', () => {
      const filters = getFilters({ holding: ['CD'] });
      expect(filterData(rows, filters)).toMatchObject([
        { site: 'Site B' },
        { site: 'Site C' }
      ]);
    });

    test('matches only results containing all given holdings', () => {
      const filters = getFilters({ holding: ['CD', 'EF'] });
      expect(filterData(rows, filters)).toMatchObject([
        { site: 'Site B' }
      ]);
    });

    test('matches using combined filters', () => {
      const filters = getFilters({
        site: ['Site B'],
        suitability: ['CD'],
        holding: ['CD', 'EF']
      });
      expect(filterData(rows, filters)).toMatchObject([
        { site: 'Site B' }
      ]);
    });
  });

  describe('searchData()', () => {
    test('returns all rows if no filter is given', () => {
      expect(searchData(rows)).toBe(rows);
    });

    test('filters by site name', () => {
      expect(searchData(rows, 'Site A')).toMatchObject([
        { site: 'Site A' }
      ]);
    });

    test('filters by partial site name', () => {
      expect(searchData(rows, 'Site')).toMatchObject([
        { site: 'Site A' },
        { site: 'Site B' },
        { site: 'Site C' }
      ]);
    });

    test('filters by area', () => {
      expect(searchData(rows, '1st Floor')).toMatchObject([
        { site: 'Site A' },
        { site: 'Site C' }
      ]);
    });

    test('filters by name', () => {
      expect(searchData(rows, '2.78')).toMatchObject([
        { site: 'Site B' }
      ]);
    });
  });
});
