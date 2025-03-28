import 'dotenv/config';
// Dev dependency, builtin
/* eslint-disable implicit-dependencies/no-implicit */
import {describe, it, jest, expect, afterEach, beforeAll, afterAll, beforeEach} from '@jest/globals';
/* eslint-enable implicit-dependencies/no-implicit */

import {dataDb} from '../scripts/lib/db.js';

// Jest does not yet provide a stable way of mocking ES Modules.
jest.unstable_mockModule('../scripts/lib/readline.js', () => ({
  readline: jest.fn()
}));

// These have to be loaded after Jest has had the opportunity to set up the readline mock
const {main} = await import('../scripts/update-protocol-locations.js');
const {readline: readlineMock} = await import('../scripts/lib/readline.js');

const ESTABLISHMENT_1_PROJECT_1_ID = '4d298d9b-a69b-441b-919e-70670f326130';
const ESTABLISHMENT_1_PROJECT_2_ID = '3e98e5cb-afc1-4084-b911-e8c058f66d3d';
const ESTABLISHMENT_2_PROJECT_1_ID = 'c1266a8d-f99d-4484-8d34-a0376c23c1f8';
const ESTABLISHMENT_3_PROJECT_1_ID = 'f88586af-bb4b-49f7-9f07-9be6efeb1523';

const ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID = '25cbb2a4-2f8f-4ed9-8809-ee86ac64d7a1';
const ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID = 'd196ddd2-272a-4fcd-ac4c-2e49c1a803cd';
const ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID = '36d4e040-6963-4fd0-896b-4857ef74d30f';
const ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID = '03f5c387-279d-4b0e-9b04-29463d3960ea';
const ESTABLISHMENT_3_PROJECT_1_VERSION_1_ID = 'e6116587-f40a-4734-8913-fa16baaf9422';

async function insertProjectVersion(id, projectId, protocolLocations, additionalEstablishmentId = undefined) {
  await dataDb.ProjectVersion.query().insert({
    id,
    projectId,
    data: {
      protocols: protocolLocations.map(list => ({locations: list}))
    }
  });

  if (additionalEstablishmentId) {
    await dataDb.ProjectEstablishment.query().insert({
      projectId,
      establishmentId: additionalEstablishmentId,
      versionId: id
    });
  }
}

async function clearVersions() {
  // Default behaviour from asl-schema is to soft delete by setting a deleted flag
  await dataDb.knex.raw(
    'DELETE FROM project_establishments WHERE establishment_id IN (?, ?, ?)',
    [1234, 4321, 5678]
  );

  await dataDb.knex.raw(
    'DELETE FROM project_versions WHERE project_id IN (?, ?, ?, ?)',
    [
      ESTABLISHMENT_1_PROJECT_1_ID,
      ESTABLISHMENT_1_PROJECT_2_ID,
      ESTABLISHMENT_2_PROJECT_1_ID,
      ESTABLISHMENT_3_PROJECT_1_ID
    ]
  );
}

async function clearProjectAndEstablishments() {
  await dataDb.knex.raw(
    'DELETE FROM projects WHERE establishment_id IN (?, ?, ?)',
    [1234, 4321, 5678]
  );

  await dataDb.knex.raw(
    'DELETE FROM establishments WHERE id IN (?, ?, ?)',
    [1234, 4321, 5678]
  );
}

async function queryLocations() {
  const resultStream = await dataDb.knex.raw(
    // language=PostgreSQL
    `SELECT pv.id, proto.idx as proto, location.value as location
     FROM projects p
            LEFT JOIN project_versions pv ON p.id = pv.project_id
            CROSS JOIN JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx)
            CROSS JOIN JSONB_ARRAY_ELEMENTS_TEXT(proto.value -> 'locations') WITH ORDINALITY AS location(value, idx)
     WHERE p.establishment_id IN (?, ?, ?)`,
    [1234, 4321, 5678]
  ).stream();

  const results = {};

  for await (const { id, proto, location } of resultStream) {
    results[id] = results[id] ?? [];
    const protoIndex = parseInt(proto) - 1;
    results[id][protoIndex] = results[id][protoIndex] ?? [];
    results[id][protoIndex].push(location);
    results[id][protoIndex].sort();
  }

  return results;
}

async function expectDatabaseLocations(expectedChanges) {
  const locations = await queryLocations();

  expect([...Object.keys(locations)].length).toEqual(5);

  expect(locations[ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID].length).toEqual(2);
  expect(locations[ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID][0])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID]?.[0] ?? ['Establishment 1']);
  expect(locations[ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID][1])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID]?.[1] ?? ['Establishment 1', 'POLE']);

  expect(locations[ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID].length).toEqual(3);
  expect(locations[ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID][0])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID]?.[0] ?? ['Establishment 1']);
  expect(locations[ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID][1])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID]?.[1] ?? ['Establishment 1', 'POLE']);
  expect(locations[ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID][2])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID]?.[2] ?? ['POLE']);

  expect(locations[ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID].length).toEqual(3);
  expect(locations[ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID][0])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID]?.[0] ?? ['Establishment 1']);
  expect(locations[ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID][1])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID]?.[1] ?? ['Establishment 1', 'Establishment 2']);
  expect(locations[ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID][2])
    .toEqual(expectedChanges[ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID]?.[2] ?? ['Establishment 2']);

  expect(locations[ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID].length).toEqual(3);
  expect(locations[ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID][0])
    .toEqual(expectedChanges[ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID]?.[0] ?? ['Establishment 2']);
  expect(locations[ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID][1])
    .toEqual(expectedChanges[ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID]?.[1] ?? ['Establishment 1', 'Establishment 2']);
  expect(locations[ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID][2])
    .toEqual(expectedChanges[ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID]?.[2] ?? ['Establishment 1']);

  expect(locations[ESTABLISHMENT_3_PROJECT_1_VERSION_1_ID].length).toEqual(1);
  expect(locations[ESTABLISHMENT_3_PROJECT_1_VERSION_1_ID][0])
    .toEqual(expectedChanges[ESTABLISHMENT_3_PROJECT_1_VERSION_1_ID]?.[0] ?? ['Establishment 3']);
}

async function expectDatabaseLocationsUnchanged() {
  await expectDatabaseLocations({});
}

describe('Update protocol locations', () => {
  beforeAll(async () => {
    await clearVersions();
    await clearProjectAndEstablishments();

    await Promise.all([
      dataDb.Establishment.query().insert({id: 1234, name: 'Establishment 1'}),
      dataDb.Establishment.query().insert({id: 4321, name: 'Establishment 2'}),
      dataDb.Establishment.query().insert({id: 5678, name: 'Establishment 3'})
    ]);

    await Promise.all([
      dataDb.Project.query().insert({
        id: ESTABLISHMENT_1_PROJECT_1_ID,
        title: 'Establishment 1 Project 1',
        establishmentId: 1234
      }),

      dataDb.Project.query().insert({
        id: ESTABLISHMENT_1_PROJECT_2_ID,
        title: 'Establishment 1 Project 2',
        establishmentId: 1234
      }),

      dataDb.Project.query().insert({
        id: ESTABLISHMENT_2_PROJECT_1_ID,
        title: 'Establishment 2 Project 1',
        establishmentId: 4321
      }),

      dataDb.Project.query().insert({
        id: ESTABLISHMENT_3_PROJECT_1_ID,
        title: 'Establishment 3 Project 1',
        establishmentId: 5678
      })
    ]);
  });

  afterAll(async () => {
    await clearVersions();
    await clearProjectAndEstablishments();
    dataDb.destroy();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Displays help', () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});

    main({help: true});

    expect(consoleMock).toBeCalledTimes(1);

    const logMessage = consoleMock.mock.calls[0][0];
    expect(logMessage).toMatch(/^update-protocol-locations.js \[opts]/);
  });

  it('validates required arguments', () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    main({});

    expect(consoleMock).toBeCalledTimes(1);

    const logMessage = consoleMock.mock.calls[0][0];
    expect(logMessage).toContain('* --current=<location> is required');
    expect(logMessage).toContain('* One of --project-version, --project, or --establishment MUST be provided.');
  });

  const validSources = [
    {
      source: {'project-version': ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID},
      expectedMessage: `Project version '${ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID}'`,
      updateCount: 1,
      expectedChanges: {
        [ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID]: [
          ['Establishment A'],
          ['Establishment A', 'POLE']
        ]
      }
    },
    {
      source: {'project': ESTABLISHMENT_1_PROJECT_1_ID},
      expectedMessage: `Project '${ESTABLISHMENT_1_PROJECT_1_ID}'`,
      updateCount: 2,
      expectedChanges: {
        [ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID]: [
          ['Establishment A'],
          ['Establishment A', 'POLE']
        ],
        [ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID]: [
          ['Establishment A'],
          ['Establishment A', 'POLE']
        ]
      }
    },
    {
      source: {'establishment': '1234'},
      expectedMessage: 'Establishment \'1234\'',
      updateCount: 4,
      expectedChanges: {
        [ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID]: [
          ['Establishment A'],
          ['Establishment A', 'POLE']
        ],
        [ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID]: [
          ['Establishment A'],
          ['Establishment A', 'POLE']
        ],
        [ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID]: [
          ['Establishment A'],
          ['Establishment 2', 'Establishment A']
        ],
        [ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID]: [
          ['Establishment 2'],
          ['Establishment 2', 'Establishment A'],
          ['Establishment A']
        ]
      }
    }
  ];

  for (const {source, expectedMessage, updateCount, expectedChanges = {}} of validSources) {
    describe(`Source: ${expectedMessage}`, () => {
      beforeEach(async () => {
        await clearVersions();

        await Promise.all([
          insertProjectVersion(
            ESTABLISHMENT_1_PROJECT_1_VERSION_1_ID,
            ESTABLISHMENT_1_PROJECT_1_ID,
            [['Establishment 1'], ['Establishment 1', 'POLE']]
          ),
          insertProjectVersion(
            ESTABLISHMENT_1_PROJECT_1_VERSION_2_ID,
            ESTABLISHMENT_1_PROJECT_1_ID,
            [['Establishment 1'], ['Establishment 1', 'POLE'], ['POLE']]
          ),
          insertProjectVersion(
            ESTABLISHMENT_1_PROJECT_2_VERSION_1_ID,
            ESTABLISHMENT_1_PROJECT_2_ID,
            [['Establishment 1'], ['Establishment 1', 'Establishment 2'], ['Establishment 2']],
            4321
          ),
          insertProjectVersion(
            ESTABLISHMENT_2_PROJECT_1_VERSION_1_ID,
            ESTABLISHMENT_2_PROJECT_1_ID,
            [['Establishment 2'], ['Establishment 2', 'Establishment 1'], ['Establishment 1']],
            1234
          ),
          insertProjectVersion(
            ESTABLISHMENT_3_PROJECT_1_VERSION_1_ID,
            ESTABLISHMENT_3_PROJECT_1_ID,
            [['Establishment 3']]
          )
        ]);
      });

      afterEach(async () => {
        readlineMock.mockReset();
      });

      it('Displays the update message for removal and aborts', async () => {
        const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
        readlineMock.mockImplementation(() => Promise.resolve(''));

        await main({current: 'Old Name', ...source});

        expect(readlineMock).toBeCalledTimes(1);
        expect(readlineMock.mock.calls[0][0]).toEqual(`Removing Old Name from protocols in ${expectedMessage}. Continue? (no): `);

        expect(consoleMock).toBeCalledTimes(1);
        expect(consoleMock.mock.calls[0][0]).toEqual(`Aborting.`);

        await expectDatabaseLocationsUnchanged();
      });

      it('Displays the update message for replacement and aborts', async () => {
        const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
        readlineMock.mockImplementation(() => Promise.resolve(''));

        await main({current: 'Old Name', replace: 'New Name', ...source});

        expect(readlineMock).toBeCalledTimes(1);
        expect(readlineMock.mock.calls[0][0]).toEqual(`Replacing Old Name with New Name for protocols in ${expectedMessage}. Continue? (no): `);

        expect(consoleMock).toBeCalledTimes(1);
        expect(consoleMock.mock.calls[0][0]).toEqual(`Aborting.`);

        await expectDatabaseLocationsUnchanged();
      });

      it('Displays the update message for replacement, queries and rolls back', async () => {
        const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
        readlineMock
          .mockReturnValueOnce(Promise.resolve('yes'))
          .mockReturnValueOnce(Promise.resolve('no'));

        await main({current: 'Establishment 1', replace: 'Establishment A', ...source});

        expect(readlineMock).toBeCalledTimes(2);
        expect(readlineMock.mock.calls[0][0]).toEqual(`Replacing Establishment 1 with Establishment A for protocols in ${expectedMessage}. Continue? (no): `);
        expect(readlineMock.mock.calls[1][0]).toEqual(`${updateCount} rows affected. Commit? (no): `);

        expect(consoleMock).toBeCalledTimes(1);
        expect(consoleMock.mock.calls[0][0]).toEqual(`Update rolled back`);

        await expectDatabaseLocationsUnchanged();
      });

      it('Displays the update message for replacement, queries and commits', async () => {
        const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
        readlineMock
          .mockReturnValueOnce(Promise.resolve('yes'))
          .mockReturnValueOnce(Promise.resolve('yes'));

        await main({current: 'Establishment 1', replace: 'Establishment A', ...source});

        expect(readlineMock).toBeCalledTimes(2);
        expect(readlineMock.mock.calls[0][0]).toEqual(`Replacing Establishment 1 with Establishment A for protocols in ${expectedMessage}. Continue? (no): `);
        expect(readlineMock.mock.calls[1][0]).toEqual(`${updateCount} rows affected. Commit? (no): `);

        expect(consoleMock).toBeCalledTimes(1);
        expect(consoleMock.mock.calls[0][0]).toEqual(`${updateCount} versions updated`);

        await expectDatabaseLocations(expectedChanges);
      });
    });
  }
});
