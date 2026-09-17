const knex = require('knex');
const report = require('../../../lib/reports/actioned-tasks');
const samples = require('./resources/sample-results.json');

function normaliseSql(sql) {
  return sql.replace(/\s+/g, ' ').trim();
}

const flow = {
  open: [
    'new',
    'resubmitted',
    'returned-to-applicant',
    'recalled-by-applicant',
    'updated',
    'with-ntco',
    'awaiting-endorsement',
    'endorsed',
    'with-licensing',
    'inspector-recommended',
    'inspector-rejected',
    'with-inspectorate',
    'referred-to-inspector',
    'intention-to-refuse',
    'recovered'
  ],
  closed: [
    'discarded-by-applicant',
    'withdrawn-by-applicant',
    'resolved',
    'rejected',
    'discarded-by-asru',
    'refused'
  ],
  withAsru: [
    'with-inspectorate',
    'with-licensing',
    'referred-to-inspector'
  ]
};

function buildReport(flowDb, start = '2026-01-01', end = '2026-01-31') {
  return report({
    db: { flow: flowDb },
    flow,
    logger: {},
    query: { start, end }
  });
}

describe('Actioned tasks report', () => {
  let flowDb;

  beforeAll(() => {
    flowDb = knex({ client: 'pg' });
  });

  afterAll(() => {
    flowDb?.destroy();
  });

  describe('query', () => {
    it('matches the SQL snapshot', () => {
      const { query } = buildReport(flowDb);

      const builtQuery = query().toSQL();

      expect(normaliseSql(builtQuery.sql)).toMatchSnapshot();
      expect(builtQuery.bindings).toMatchSnapshot();
    });
  });

  describe('parse', () => {
    describe('parses the sample PPL licences', () => {
      const { parse } = buildReport(flowDb, '2026-02-01', '2026-02-28');

      for (const [licence, {data, expected}] of Object.entries(samples)) {
        it(`parses ${licence}`, () => {
          expect(parse(data)).toEqual(expected);
        });
      }
    });
  });
});
