#!/usr/bin/env node
import 'dotenv/config';

import {dataDb} from './lib/db.js';
import {readline} from './lib/readline.js';
import minimist from 'minimist';
import {isCliEntrypoint} from './lib/cli.js';

/**
 * Instructions for using this script as a CLI tool
 *
 * If updating this also update [docs/update-protocol-locations.md](../docs/update-protocol-locations.md)
 *
 * @type {string}
 */
const usage = `update-protocol-locations.js [opts]

Renames or removes protocol locations from project licence versions.

Options:
--current=<location>     The location shown in the versions' protocols that should be removed or renamed (required)
--project-version=<uuid> If provided, this specific version will be updated
--project=<uuid>         If provided, this all versions for this project licence will be updated  
--establishment=<id>     If provided, all project versions at this establishment will be updated
--replace=<location>     If provided, the current location will be replaced with this when found. Otherwise, the current
                         location will be removed.
--help                   Display this help message

One of project-version, project, or establishment MUST be provided. If multiple are provided, project-version will be
used if provided, otherwise project, and finally establishment. 
`;

/**
 * Validate that the location to be renamed has been provided in the script's arguments
 *
 * @param argv The parsed arguments provided to the script
 * @returns {string[]} Array of validation error messages. An empty array indicates the arguments are valid
 */
function validateCurrentArgument(argv) {
  return argv.current ? [] : ['--current=<location> is required'];
}

/**
 * Validate that a scope for the project version(s) to be updated has been provided
 *
 * @param argv {object} The parsed arguments provided to the script
 * @returns {string[]} Array of validation error messages. An empty array indicates the arguments are valid
 */
function validateTargetArguments(argv) {
  return argv['project-version'] || argv['project'] || argv['establishment']
    ? []
    : ['One of --project-version, --project, or --establishment MUST be provided.'];
}

/**
 * Render the requested action as a human-readable string based on the cli arguments
 *
 * @param current {string} The location name to be replaced/removed
 * @param replace {string | undefined}The location name to use as a replacement, or undefined if the location is being removed
 * @param targetType {string} the label for the search criteria
 * @param targetId {string} the id for the search criteria
 * @returns {string} the message describing the action
 */
function buildUpdateMessage(current, replace, targetType, targetId) {
  return replace
    ? `Replacing ${current} with ${replace} for protocols in ${targetType} '${targetId}'`
    : `Removing ${current} from protocols in ${targetType} '${targetId}'`;
}

/**
 * Query a single project version if it has the expected current location name
 *
 * @param current {string} The location name to be replaced/removed
 * @param projectVersionUUID {string} the UUID of the project version to be queried
 * @param transaction An open Knex transaction with which to query the database
 * @returns A Knex query
 */
function buildProjectVersionQuery(current, projectVersionUUID, transaction) {
  return transaction.raw(
    // language=PostgreSQL
    `
            SELECT pv.id, any_value(pv.data) AS data
            FROM project_versions pv
                     CROSS JOIN JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx)
                     CROSS JOIN JSONB_ARRAY_ELEMENTS_TEXT(proto.value -> 'locations') WITH ORDINALITY AS location(value, idx)
            WHERE pv.id = :projectVersionUUID
              AND location.value = :current
            GROUP BY pv.id;
        `,
    {projectVersionUUID, current}
  );
}

/**
 * Query all versions for a specific project that have the expected current location name
 *
 * @param current {string} The location name to be replaced/removed
 * @param projectUUID {string} the UUID of the project to be queried
 * @param transaction An open Knex transaction with which to query the database
 * @returns A Knex query
 */
function buildProjectQuery(current, projectUUID, transaction) {
  return transaction.raw(
    // language=PostgreSQL
    `
            SELECT pv.id, any_value(pv.data) as data
            FROM project_versions pv 
                     CROSS JOIN JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx)
                     CROSS JOIN JSONB_ARRAY_ELEMENTS_TEXT(proto.value -> 'locations') WITH ORDINALITY AS location(value, idx)
            WHERE pv.project_id = :projectUUID
              AND location.value = :current
            GROUP BY pv.id;
        `,
    {projectUUID, current}
  );
}

/**
 * Stream all versions for all projects with primary or additional availability at the specified establishment that have
 * the expected current location name
 *
 * @param current {string} The location name to be replaced/removed
 * @param establishmentId {string} the id of the establishment  to be queried
 * @param transaction An open Knex transaction with which to query the database
 * @returns A Knex query
 */
function buildEstablishmentQuery(current, establishmentId, transaction) {
  return transaction.raw(
    // language=PostgreSQL
    `
          SELECT pv.id, any_value(pv.data) as data
          FROM projects p
               LEFT JOIN project_versions pv ON p.id = pv.project_id
               LEFT JOIN project_establishments pe ON p.id = pe.project_id
               CROSS JOIN JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx)
               CROSS JOIN JSONB_ARRAY_ELEMENTS_TEXT(proto.value -> 'locations') WITH ORDINALITY AS location(value, idx)
          WHERE (p.establishment_id = :establishmentId OR pe.establishment_id = :establishmentId)
            AND location.value = :current
          GROUP BY pv.id;
    `,
    {establishmentId, current}
  );
}

/**
 * Return a message describing the action to be performed and a Knex query implementing the necessary search
 *
 * @param argv {object} The arguments passed to the script
 * @param transaction An open Knex transaction with which to query the database
 * @returns {[string, *]} The action message and Knex query
 * @throws {Error<string>} If a project version source is not found in the arguments
 */
function buildTargetQuery(argv, transaction) {
  const {current, replace} = argv;

  if (argv['project-version']) {
    return [
      buildUpdateMessage(current, replace, 'Project version', argv['project-version']),
      buildProjectVersionQuery(current, argv['project-version'], transaction)
    ];
  }

  if (argv['project']) {
    return [
      buildUpdateMessage(current, replace, 'Project', argv['project']),
      buildProjectQuery(current, argv['project'], transaction)
    ];
  }

  if (argv['establishment']) {
    return [
      buildUpdateMessage(current, replace, 'Establishment', argv['establishment']),
      buildEstablishmentQuery(current, argv['establishment'], transaction)
    ];
  }

  throw new Error('No target argument was provided');
}

/**
 * For each id/data pair in the result stream, asynchronously remove/replace the current location name in each
 * protocols' location list.
 *
 * @param argv {object} The scripts arguments
 * @param transaction An open Knex transaction with which to query the database
 * @param resultStream {AsyncIterable<{id: string, data: object}>} The project versions to be updated
 * @returns {Promise<number>} The number of updates performed
 */
async function performUpdates(argv, transaction, resultStream) {
  const {current, replace} = argv;
  const updates = [];

  for await (const {id: versionId, data} of resultStream) {
    // Remove old and add new only where new establishment is a location, avoiding duplicates.
    data.protocols.forEach(protocol => {
      if (protocol.locations?.includes(current)) {
        protocol.locations = [
          ...new Set([
            ...protocol.locations.filter(location => location !== current),
            ...(replace ? [replace] : [])
          ])
        ];
      }
    });

    updates.push(dataDb.ProjectVersion.query(transaction).where({ id: versionId }).update({ data }));
  }

  await Promise.all(updates);

  return updates.length;
}

/**
 * The entry point for the script. It:
 * - Validates the arguments
 * - Confirms with the user the action to be taken
 * - Queries project versions that match the script's arguments
 * - Updates the protocol->location lists, removing the `current` location, and replacing with `replace` if provided
 * - Confirms the update count with the user
 * - Commits or rolls-back the transaction
 *
 * @param argv {object} the command-line arguments passed to the script
 * @returns {Promise<number>} the exit code - 1 if updates were not performed, or 0 if successful
 */
export async function main(argv) {
  if (argv.help) {
    console.log(usage);
    return 0;
  }

  const argumentErrors = [
    ...validateCurrentArgument(argv),
    ...validateTargetArguments(argv)
  ];

  if (argumentErrors.length > 0) {
    console.log(`Invalid options: 
${argumentErrors.map(e => `  * ${e}`).join('\n')}

${usage}`);
    return 1;
  }

  const transaction = await dataDb.transaction();
  const [message, query] = buildTargetQuery(argv, transaction);

  const keepGoing = await readline(`${message}. Continue? (no): `);
  if (!(['y', 'yes', 'continue'].includes(keepGoing.toLowerCase()))) {
    console.log('Aborting.');
    await transaction.rollback();
    return 1;
  }

  const updateCount = await performUpdates(argv, transaction, query.stream());

  const commit = await readline(`${updateCount} rows affected. Commit? (no): `);
  if (!(['y', 'yes', 'commit'].includes(commit.toLowerCase()))) {
    await transaction.rollback();
    console.log('Update rolled back');
    return 1;
  }

  await transaction.commit();
  console.log(`${updateCount} versions updated`);
}

if (isCliEntrypoint(import.meta.url)) {
  const argv = minimist(process.argv.slice(2));
  const exitCode = await main(argv) ?? 0;

  process.exit(exitCode);
}
