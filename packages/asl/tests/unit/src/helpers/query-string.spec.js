const { parse, format } = require('src/helpers/query-string');

describe('Query String Helper', () => {
  const filters = [
    { filterBy: { site: [], suitability: [], holding: [] } },
    { filterBy: { site: ['A Site'], suitability: ['AA'], holding: [] }, textFilter: 'Something' },
    { filterBy: { site: [], suitability: ['BB', 'CC'], holding: ['AA'] } },
    { filterBy: { site: ['Something'], suitability: ['DD', 'EE'], holding: ['AA'] }, textFilter: 'TEST' }
  ];
  const queryStrings = [
    '',
    'filterBy%5Bsite%5D%5B0%5D=A%20Site&filterBy%5Bsuitability%5D%5B0%5D=AA&textFilter=Something',
    'filterBy%5Bsuitability%5D%5B0%5D=BB&filterBy%5Bsuitability%5D%5B1%5D=CC&filterBy%5Bholding%5D%5B0%5D=AA',
    'filterBy%5Bsite%5D%5B0%5D=Something&filterBy%5Bsuitability%5D%5B0%5D=DD&filterBy%5Bsuitability%5D%5B1%5D=EE&filterBy%5Bholding%5D%5B0%5D=AA&textFilter=TEST'
  ];

  describe('format()', () => {
    test('uses qs to create a query string from the filters state', () => {
      filters.forEach((filter, index) => {
        expect(format(filter)).toEqual(queryStrings[index]);
      });
    });
  });

  describe('parse()', () => {
    test('reads the filters from the url', () => {
      queryStrings.forEach((qs, index) => {
        expect(filters[index]).toMatchObject(parse(`http://localhost:8080?${qs}`));
      });
    });
  });
});
