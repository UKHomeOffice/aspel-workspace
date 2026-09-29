const assert = require('assert');
const { randomUUID } = require('crypto');
const Zip = require('jszip');
const { BufferListStream } = require('bl');
const parse = require('csv-parse/lib/sync');

const Builder = require('../../lib/exporters/rops');

const db = require('../helpers/db');

const PROFILE_ID = randomUUID();
const PROJECT_ID = randomUUID();
const ROP_ID = randomUUID();

jest.setTimeout(10000);

describe('ROPs Exporter', () => {
  let models;
  let exportToZip;
  let returns;
  let procedures;

  beforeEach(async () => {
    models = await db().init();

    exportToZip = async params => {
      let zipBuffer;

      const exporter = Builder({
        models,
        s3Upload: ({ stream }) => {
          return new Promise((resolve, reject) => {
            stream.pipe(new BufferListStream((err, result) => {
              if (err) {
                return reject(err);
              }
              zipBuffer = result;
              return resolve({ ETag: 'abc' });
            }));
          });
        }
      });

      await exporter(params);
      return Zip.loadAsync(zipBuffer);
    };

    const { Establishment, Project, Procedure, Profile, Rop } = models;

    await Establishment.query().insert({
      id: 100,
      name: 'Test Establishment'
    });

    await Profile.query().insert({
      id: PROFILE_ID,
      firstName: 'Test',
      lastName: 'User',
      email: 'tu@example.com'
    });

    await Project.query().insert([
      {
        id: PROJECT_ID,
        establishmentId: 100,
        licenceHolderId: PROFILE_ID,
        licenceNumber: 'PROJ0001',
        title: 'Test Project',
        status: 'active',
        issueDate: '2019-01-01T12:00:00.000Z',
        expiryDate: '2024-01-01T12:00:00.000Z'
      },
      {
        id: randomUUID(),
        establishmentId: 100,
        licenceHolderId: PROFILE_ID,
        licenceNumber: 'PROJ0002',
        title: 'Test Project 2',
        status: 'active',
        issueDate: '2019-01-01T12:00:00.000Z',
        expiryDate: '2024-01-01T12:00:00.000Z'
      },
      {
        id: randomUUID(),
        establishmentId: 100,
        licenceHolderId: PROFILE_ID,
        licenceNumber: 'PROJ0003',
        title: 'Test Project 3',
        status: 'revoked',
        issueDate: '2019-01-01T12:00:00.000Z',
        expiryDate: '2024-01-01T12:00:00.000Z',
        revocationDate: '2021-01-01T12:00:00.000Z'
      }
    ]);

    await Rop.query().insert({
      id: ROP_ID,
      projectId: PROJECT_ID,
      year: 2021,
      status: 'submitted',
      purposes: ['basic'],
      basicSubpurposes: ['oncology']
    });

    await Procedure.query().insert([
      {
        ropId: ROP_ID,
        species: 'mice',
        ga: 'false',
        purposes: 'basic',
        basicSubpurposes: 'oncology',
        newGeneticLine: false,
        severity: 'mild',
        severityNum: 100
      },
      {
        ropId: ROP_ID,
        species: 'mice',
        ga: 'false',
        purposes: 'basic',
        basicSubpurposes: 'oncology',
        newGeneticLine: false,
        severity: 'severe',
        severityNum: 200
      },
      {
        ropId: ROP_ID,
        species: 'common-frogs',
        ga: 'false',
        purposes: 'basic',
        basicSubpurposes: 'oncology',
        newGeneticLine: false,
        severity: 'severe',
        severityNum: 300,
        severityHoNote: 'Common Frogs'
      }
    ]);
  });

  afterEach(() => {
    const result = models ? models.destroy() : Promise.resolve();
    models = null;
    exportToZip = null;
    returns = null;
    procedures = null;
    return result;
  });

  describe('returns list', () => {
    beforeEach(() => {
      return exportToZip({ id: '1', key: 2021 })
        .then(result => result.file('returns.csv').async('string'))
        .then(csv => parse(csv, { columns: true }))
        .then(csv => {
          returns = csv;
        });
    });

    it('contains columns expected by stats team - DO NOT REMOVE OR CHANGE KEYS', () => {
      const expected = [
        'id',
        'licence_number',
        'establishment_id',
        'title',
        'project_status',
        'issue_date',
        'expiry_date',
        'revocation_date',
        'first_name',
        'last_name',
        'email',
        'telephone',
        'year',
        'status',
        'procedures_completed',
        'postnatal',
        'endangered',
        'endangered_details',
        'nmbas',
        'general_anaesthesia',
        'general_anaesthesia_details',
        'rodenticide',
        'rodenticide_details',
        'schedule_two_details',
        'procedure_count',
        'due_date',
        'submission_date'
      ];
      assert.deepEqual(Object.keys(returns[0]), expected);
    });

    it('loads project data into returns list', () => {
      assert.equal(returns.length, 3);

      const proj1 = returns.find(row => row.licence_number === 'PROJ0001');
      const proj2 = returns.find(row => row.licence_number === 'PROJ0002');
      const proj3 = returns.find(row => row.licence_number === 'PROJ0003');

      assert.equal(proj1.first_name, 'Test');
      assert.equal(proj1.last_name, 'User');
      assert.equal(proj1.status, 'submitted');
      assert.equal(proj1.procedure_count, '3');

      assert.equal(proj2.first_name, 'Test');
      assert.equal(proj2.last_name, 'User');
      assert.equal(proj2.status, 'not started');
      assert.equal(proj2.procedure_count, '0');

      assert.equal(proj3.revocation_date, '2021-01-01T12:00:00.000Z');
    });
  });

  describe('procedures list', () => {
    beforeEach(() => {
      return exportToZip({ id: '1', key: 2021 })
        .then(result => result.file('procedures.csv').async('string'))
        .then(csv => parse(csv, { columns: true }))
        .then(csv => {
          procedures = csv;
        });
    });

    it('contains columns expected by stats team - DO NOT REMOVE OR CHANGE KEYS', () => {
      const expected = [
        'return_id',
        'id',
        'species',
        'other_species',
        'endangered',
        'no_of_procedures',
        'reuse',
        'place_of_birth',
        'nhp_place_of_birth',
        'nhp_colony_status',
        'nhp_generation',
        'genetic_status',
        'creation_of_new_genetic_line',
        'purpose',
        'sub_purpose',
        'sub_purpose_other',
        'testing_by_legislation',
        'legislation_other',
        'legislative_requirements',
        'technique_of_special_interest',
        'actual_severity',
        'comments_for_ho',
        'comments_for_personal_use',
        'ppl_number'
      ];
      assert.deepEqual(Object.keys(procedures[0]), expected);
    });

    it('maps sub-purposes to single column', () => {
      assert.equal(procedures[0].sub_purpose, 'oncology');
    });

    it('maps common-frogs to african-frogs', () => {
      const procedure = procedures.find(p => p.comments_for_ho === 'Common Frogs');
      assert.ok(procedure);
      assert.equal(procedure.species, 'african-frogs');
    });
  });
});
