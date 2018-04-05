const { filterBy, textFilter } = require('src/reducers/filters');

describe('Filters Reducer', () => {
  describe('textFilter', () => {
    const initialState = '';

    test('handles SET_TEXT_FILTER', () => {
      const action = {
        type: 'SET_TEXT_FILTER',
        text: 'Text Filter'
      };
      expect(textFilter(initialState, action)).toBe('Text Filter');
    });

    test('handles CLEAR_FILTERS', () => {
      const action = {
        type: 'CLEAR_FILTERS'
      };
      expect(textFilter('something', action)).toBe('');
    });
  });

  describe('filterBy', () => {
    const initialState = {
      site: [],
      suitability: [],
      holding: []
    };
    test('handles TOGGLE_FILTER', () => {
      const fixtures = [
        { key: 'site', value: 'Test Site' },
        { key: 'site', value: 'Test Site 2' },
        { key: 'site', value: 'Test Site' },
        { key: 'suitability', value: 'AA' },
        { key: 'holding', value: 'BB' },
        { key: 'site', value: 'Test Site 2' },
        { key: 'holding', value: 'BB' }
      ];
      const expectedStates = [
        { site: ['Test Site'], suitability: [], holding: [] },
        { site: ['Test Site', 'Test Site 2'], suitability: [], holding: [] },
        { site: ['Test Site 2'], suitability: [], holding: [] },
        { site: ['Test Site 2'], suitability: ['AA'], holding: [] },
        { site: ['Test Site 2'], suitability: ['AA'], holding: ['BB'] },
        { site: [], suitability: ['AA'], holding: ['BB'] },
        { site: [], suitability: ['AA'], holding: [] }
      ];
      fixtures.reduce((state, fixture, index) => {
        const newState = filterBy(state, { type: 'TOGGLE_FILTER', ...fixture });
        expect(newState).toMatchObject(expectedStates[index]);
        return newState;
      }, initialState);
    });

    test('handles CLEAR_FILTERS', () => {
      const state = {
        site: ['a', 'b', 'c'],
        suitability: ['a', 'b', 'c'],
        holding: ['a', 'b', 'c']
      };
      expect(filterBy(state, { type: 'CLEAR_FILTERS' })).toEqual(initialState);
    });
  });
});
