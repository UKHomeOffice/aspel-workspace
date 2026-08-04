const report = require('../../../lib/reports/establishments');

let EXAMPLE_PELH = {
  'id': '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
  'migrated_id': null,
  'user_id': '304cae96-0f56-492a-9f66-e99c2b3990c7',
  'title': 'Dr',
  'first_name': 'Bruce',
  'last_name': 'Banner',
  'dob': '1970-04-23',
  'position': 'University Vice-Chancellor',
  'qualifications': 'BLib',
  'certifications': '',
  'address': 'Lunar House\nSydenham Road,\nCroydon\nLondon',
  'postcode': 'CR0 2YF',
  'email': 'vice-chancellor@example.com',
  'telephone': '01840 345 678',
  'notes': '',
  'created_at': '2024-09-23T08:54:03.644527+00:00',
  'updated_at': '2024-09-23T08:54:03.644527+00:00',
  'deleted': null,
  'asru_user': false,
  'asru_admin': false,
  'asru_licensing': false,
  'asru_inspector': false,
  'asru_support': false,
  'telephone_alt': null,
  'pil_licence_number': null,
  'rcvs_number': null,
  'email_confirmed': true,
  'last_login': '2024-09-23T10:07:40.312+00:00',
  'asru_rops': false
};

const EXAMPLE_ESTABLISHMENT_DB_ROW = {
  'id': 8202,
  'name': 'Marvell Pharmaceutical',
  'licence_number': 'XCC09J64D',
  'status': 'active',
  'issue_date': '2017-07-04T10:54:00.000Z',
  'revocation_date': null,
  'procedure': true,
  'breeding': true,
  'supplying': true,
  'killing': true,
  'rehomes': true,
  'suitabilities': [['CAT', 'EQU'], ['AQ', 'EQU']],
  'pelh': [
    EXAMPLE_PELH,
    EXAMPLE_PELH
  ],
  'holc': [null, null],
  'asru': [null, null]
};

function buildDbMock() {
  const mockBuilder = {};
  mockBuilder.count = jest.fn(arg => {
    expect(arg).toBe('*');
    return mockBuilder;
  });
  // eslint-disable-next-line camelcase
  mockBuilder.where = jest.fn(({establishment_id, status, deleted}) => {
    expect(establishment_id).toBe(8202);
    expect(deleted).toBe(null);
    switch (status) {
      case 'active':
        return Promise.resolve([{count: 1}]);
      case 'inactive':
        return mockBuilder;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
  // Inner builders are not checked as function name is enough to determine which count is expected
  mockBuilder.whereExists = jest.fn(() => Promise.resolve([{count: 2}]));
  mockBuilder.whereNotExists = jest.fn(() => Promise.resolve([{count: 3}]));

  return {
    asl: jest.fn(key => {
      expect(key).toBe('projects');
      return mockBuilder;
    })
  };
}

describe('Establishment Report', () => {
  describe('parse', () => {
    it('maps suitabilities to unique list of species names', async () => {
      const mockDb = buildDbMock();

      const reportRow = await report({db: mockDb}).parse(EXAMPLE_ESTABLISHMENT_DB_ROW);

      expect(reportRow['species held']).toBe('Aquatic species,Cats,Equidae');
    });
  });
});
