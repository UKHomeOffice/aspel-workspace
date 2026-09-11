const { randomUUID } = require('crypto');
const { flatten } = require('lodash');

const db = require('../helpers/db');
const flow = require('../helpers/flow');
const report = require('../../../lib/reports/ppl-applications');

const ids = {
  task: randomUUID(),
  issueDateTask: randomUUID(),
  active: randomUUID(),
  issueDate: randomUUID()
};

describe('PPL Applications Report', () => {

  let testDb;

  beforeAll(() => {
    testDb = db();
    return testDb.clean();
  });

  beforeAll(() => {
    return Promise.resolve()
      .then(() => testDb.flow('cases').insert([
        {
          id: ids.task,
          status: 'resolved',
          data: {
            model: 'project',
            action: 'grant',
            id: ids.active,
            deadline: {
              isExtended: true
            },
            modelData: {
              status: 'inactive'
            }
          },
          created_at: '2020-01-11T12:00:00.000'
        },
        {
          id: ids.issueDateTask,
          status: 'resolved',
          data: {
            model: 'project',
            action: 'grant',
            id: ids.issueDate,
            modelData: {
              status: 'inactive'
            }
          },
          created_at: '2020-01-12T12:00:00.000'
        }
      ]))
      .then(() => testDb.flow('activity_log').insert([
        {
          case_id: ids.issueDateTask,
          event_name: 'status:new:awaiting-endorsement',
          event: {},
          created_at: '2020-01-12T12:00:00.000'
        },
        {
          case_id: ids.task,
          event_name: 'status:new:awaiting-endorsement',
          event: {},
          created_at: '2020-01-11T12:00:00.000'
        },
        {
          case_id: ids.task,
          event_name: 'status:awaiting-endorsement:with-inspectorate',
          event: {},
          created_at: '2020-01-16T12:00:00.000'
        },
        {
          case_id: ids.task,
          event_name: 'status:with-inspectorate:inspector-recommended',
          event: {},
          created_at: '2020-01-21T12:00:00.000'
        },
        {
          case_id: ids.task,
          event_name: 'update',
          comment: 'Complex application requires extension',
          event: {
            meta: {
              payload: {
                data: {
                  deadline: {
                    isExtended: true
                  }
                }
              }
            }
          },
          created_at: '2020-01-22T12:00:00.000'
        },
        {
          case_id: ids.task,
          event_name: 'status:inspector-recommended:resolved',
          event: {},
          created_at: '2020-01-26T12:00:00.000'
        }
      ]))
      .then(() => testDb.asl('establishments').insert({
        id: 100, name: 'Test Establishment', status: 'active'
      }))
      .then(() => testDb.asl('projects').insert([
        {
          id: ids.active,
          establishment_id: 100,
          title: 'Active Project',
          status: 'active',
          licence_number: 'P1234',
          issue_date: '2020-01-26T12:00:00.000',
          created_at: '2020-01-01T12:00:00.000'
        },
        {
          id: ids.issueDate,
          establishment_id: 100,
          title: 'Changed issue date',
          status: 'active',
          licence_number: 'P1111',
          issue_date: '2018-01-01T12:00:00.000',
          created_at: '2020-01-01T12:00:00.000'
        }
      ]))
      .then(() => testDb.asl('project_versions').insert([
        {
          project_id: ids.active,
          data: {
            protocols: [{ severity: 'mild' }, { severity: 'severe' }]
          },
          status: 'granted',
          created_at: '2020-02-01T12:00:00.000'
        }
      ]));
  });

  afterAll(() => {
    return testDb.close();
  });

  it('returns one row per complete project application', () => {
    const { query, parse } = report({ db: testDb, flow });
    return query()
      .then(result => result.map(parse))
      .then(result => Promise.all(result))
      .then(result => flatten(result))
      .then(result => {
        expect(result.length).toBe(1);
      });
  });

  it('calculates timing of phases of application', () => {
    const { query, parse } = report({ db: testDb, flow });
    return query()
      .then(result => result.map(parse))
      .then(result => Promise.all(result))
      .then(result => flatten(result))
      .then(result => {
        expect(result[0].totalTime).toBe(25);
        expect(result[0].timeDraftingPreSubmission).toBe(10);
        expect(result[0].timeWithEstablishment).toBe(15);
        expect(result[0].timeWithInspector).toBe(5);
        expect(result[0].timeWithLicensing).toBe(5);
        expect(result[0].timeWithASRU).toBe(10);
        expect(result[0].timeWithASRUPercentage).toBe('40%');
      });
  });

  it('ignores projects with issue dates pre-aspel', () => {
    const { query, parse } = report({ db: testDb, flow });
    return query()
      .then(result => result.map(parse))
      .then(result => Promise.all(result))
      .then(result => flatten(result))
      .then(result => {
        expect(result.every(row => row.title !== 'Changed issue date')).toBe(true);
      });
  });

  it('includes deadline extension details from update activity', () => {
    const { query, parse } = report({ db: testDb, flow });
    return query()
      .then(result => result.map(parse))
      .then(result => Promise.all(result))
      .then(result => flatten(result))
      .then(result => {
        expect(result[0].wasExtended).toBe('Yes');
        expect(result[0].extendedReason).toBe('Complex application requires extension');
      });
  });

});
