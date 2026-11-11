/**
 * ASL-5165 - Project licence data insights: reasons for return.
 *
 * Exports three CSVs covering PPL (project) applications:
 *
 *   1. <prefix>-return-reasons.csv       - every "returned to applicant" event, with the reason given.
 *   2. <prefix>-field-comments.csv       - every comment left against a PPL field, resolved to its question.
 *                                          Comments withdrawn (deleted) by their author are excluded.
 *   3. <prefix>-field-comment-counts.csv - (2) aggregated per question, most commented-on first.
 *
 * Usage:
 *   node scripts/ppl-returns-data-export.js [--startDate=YYYY-MM-DD] [--endDate=YYYY-MM-DD]
 *                                           [--file=prefix] [--cohortDate=YYYY-MM-DD]
 *
 *   --startDate   Start of the reporting window. Defaults to two years before today.
 *   --endDate     End of the reporting window. Defaults to today.
 *   --file        Output file prefix. Defaults to "ppl-returns".
 *   --cohortDate  ASRU users whose first task status change is on/after this date are in the "new"
 *                 `inspector_cohort`, earlier ones are "previous". Defaults to 2025-10-01.
 *
 * Requires the same DATABASE_* / ASL_DATABASE_* environment variables as the metrics service.
 */

require('@asl/service/lib/register'); // required to transpile imports from @asl/projects

const path = require('path');
const fastCsv = require('fast-csv');
const moment = require('moment');
const minimist = require('minimist');
const settings = require('../config');

const knexTaskflow = require('knex')({ client: 'pg', connection: settings.workflowdb });
const knexASL = require('knex')({ client: 'pg', connection: settings.asldb });

const args = minimist(process.argv.slice(2));
const startDate = args.startDate || moment().subtract(2, 'years').format('YYYY-MM-DD');
const endDate = args.endDate || moment().format('YYYY-MM-DD');
const cohortDate = args.cohortDate || '2025-10-01';
const prefix = (args.file || 'ppl-returns').replace(/\.csv$/, '');

Object.entries({ startDate, endDate, cohortDate }).forEach(([name, value]) => {
  if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
    console.error(`Invalid --${name}=${value}, expected YYYY-MM-DD`);
    process.exit(1);
  }
});

const BATCH_SIZE = 100;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// uuids and array indexes in comment field keys identify a repeater item rather than a question
const isId = segment => UUID.test(segment) || /^\d+$/.test(segment);
const fieldPathOf = fieldKey => (fieldKey || '').split('.').filter(s => s && !isId(s));
const normaliseFieldKey = fieldKey => (fieldKey || '').split('.').map(s => (isId(s) ? '*' : s)).join('.');

// some labels are functions of the project (e.g. training licence wording), use the default wording
function resolveLabel(label) {
  try {
    const text = typeof label === 'function' ? label({}, {}, {}) : label;
    return typeof text === 'string' ? text : '';
  } catch (error) {
    return '';
  }
}

/**
 * Builds field name -> { label, section, subsection } lookups from the PPL schema. Each field is
 * recorded by bare name and as `<subsection>.<name>`. Protocol questions get their own lookup as
 * several names (`title`, `objectives`, `experience`) exist both inside and outside a protocol.
 */
function buildQuestionLookup() {
  const general = {};
  const protocol = {};

  const record = (lookup, key, label, isQuestion, section, subsection) => {
    const existing = lookup[key];
    // a question label beats a fallback title, otherwise first definition wins
    if (existing && (existing.isQuestion || !isQuestion)) {
      return;
    }
    lookup[key] = { label: label || '', isQuestion, section: section || '', subsection: subsection || '' };
  };

  const addSubsection = (lookup, subsectionKey, subsection, section) => {
    const visited = new WeakSet();
    const visit = node => {
      if (!node || typeof node !== 'object' || visited.has(node)) {
        return;
      }
      visited.add(node);
      if (typeof node.name === 'string') {
        const questionLabel = resolveLabel(node.label);
        const label = questionLabel || node.title;
        if (typeof label === 'string' && label) {
          record(lookup, node.name, label, !!questionLabel, section, subsection.title);
          record(lookup, `${subsectionKey}.${node.name}`, label, !!questionLabel, section, subsection.title);
        }
      }
      Object.values(node).forEach(visit);
    };
    visit(subsection);
    record(lookup, subsectionKey, subsection.title, false, section, subsection.title);
  };

  try {
    const projectSchema = require('@asl/projects/client/schema/v1').default();
    const protocolSchema = require('@asl/projects/client/schema/v1/protocols').default;

    Object.entries(projectSchema).forEach(([sectionKey, section]) => {
      const lookup = sectionKey === 'protocols' ? protocol : general;
      Object.entries(section.subsections || {}).forEach(([key, subsection]) => addSubsection(lookup, key, subsection, section.title));
    });
    Object.entries(protocolSchema || {}).forEach(([key, subsection]) => addSubsection(protocol, key, subsection, 'Protocols'));
  } catch (error) {
    console.warn(`Could not load the PPL schema, question labels will be blank: ${error.message}`);
  }

  // rendered by the protocol repeater rather than declared as a schema field
  protocol.title = { label: 'Protocol title', isQuestion: true, section: 'Protocols', subsection: 'Protocol details' };

  return { general, protocol };
}

/**
 * Resolves a comment's field key to a question, most specific match first, e.g.
 * `protocols.<uuid>.steps.<uuid>.title` is tried as `steps.title` before `title`.
 */
function resolveQuestion(fieldKey, questions) {
  const fieldPath = fieldPathOf(fieldKey);
  const inProtocol = fieldPath[0] === 'protocols';
  const segments = inProtocol ? fieldPath.slice(1) : fieldPath;
  const candidates = [segments.slice(-2).join('.'), segments.slice(-1).join('.')].filter(Boolean);
  const lookups = inProtocol ? [questions.protocol, questions.general] : [questions.general];

  for (const lookup of lookups) {
    const match = candidates.find(candidate => lookup[candidate]);
    if (match) {
      return lookup[match];
    }
  }
  return { label: '', section: '', subsection: '' };
}

async function inBatches(ids, fetchBatch) {
  const unique = [...new Set(ids.filter(Boolean))];
  const rows = [];
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    rows.push(...await fetchBatch(unique.slice(i, i + BATCH_SIZE)));
  }
  return rows;
}

const byKey = (rows, key) => Object.fromEntries(rows.map(row => [row[key], row]));

const getProjects = async ids => byKey(await inBatches(ids, batch => knexASL('projects')
  .select('projects.id', 'projects.title', 'projects.licence_number', 'establishments.name as establishment')
  .leftJoin('establishments', 'projects.establishment_id', 'establishments.id')
  .whereIn('projects.id', batch)), 'id');

const getProfiles = async ids => byKey(await inBatches(ids, batch => knexASL('profiles')
  .select('id', 'first_name', 'last_name', 'asru_user', 'asru_inspector', 'asru_licensing')
  .whereIn('id', batch)), 'id');

// first status change made by each profile on any task - a proxy for when an inspector started
const getFirstActivity = async ids => byKey(await inBatches(ids, batch => knexTaskflow('activity_log')
  .select('changed_by')
  .min('created_at as first_seen_at')
  .whereIn('changed_by', batch)
  .where('event_name', 'like', 'status:%')
  .groupBy('changed_by')), 'changed_by');

async function getReturns(start, end) {
  // number returns across the case's full history, then apply the reporting window
  const { rows } = await knexTaskflow.raw(`
    SELECT * FROM (
      SELECT
        c.id AS case_id,
        c.data->>'id' AS project_id,
        c.data->>'action' AS case_action,
        c.data->'modelData'->>'status' AS model_status,
        al.created_at,
        SPLIT_PART(al.event_name, ':', 2) AS returned_from_status,
        al.changed_by AS profile_id,
        al.event->'meta'->'user'->'profile'->>'name' AS name_snapshot,
        al.comment AS return_reason,
        ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY al.created_at) AS return_number
      FROM cases c
      INNER JOIN activity_log al ON al.case_id = c.id
      WHERE c.data->>'model' = 'project'
        AND al.event_name LIKE 'status:%:returned-to-applicant'
    ) r
    WHERE r.created_at BETWEEN ? AND ?
    ORDER BY r.created_at
  `, [start, end]);
  return rows;
}

async function getComments(start, end) {
  const { rows } = await knexTaskflow.raw(`
    WITH latest_updates AS (
      SELECT DISTINCT ON (event->'meta'->>'id') event->'meta'->>'id' AS comment_id, comment
      FROM activity_log
      WHERE event_name = 'update-comment'
      ORDER BY event->'meta'->>'id', created_at DESC
    ),
    deletions AS (
      SELECT DISTINCT event->'meta'->>'id' AS comment_id
      FROM activity_log
      WHERE event_name = 'delete-comment'
    )
    SELECT
      c.id AS case_id,
      c.data->>'id' AS project_id,
      c.data->>'action' AS case_action,
      c.data->'modelData'->>'status' AS model_status,
      al.created_at,
      al.changed_by AS profile_id,
      al.event->'meta'->'user'->'profile'->>'name' AS name_snapshot,
      al.event->'meta'->'payload'->'meta'->>'field' AS field_key,
      COALESCE(u.comment, al.comment) AS comment_text
    FROM cases c
    INNER JOIN activity_log al ON al.case_id = c.id
    LEFT JOIN latest_updates u ON u.comment_id = al.id::text
    LEFT JOIN deletions d ON d.comment_id = al.id::text
    WHERE c.data->>'model' = 'project'
      AND al.event_name = 'comment'
      AND d.comment_id IS NULL
      AND al.created_at BETWEEN ? AND ?
    ORDER BY al.created_at
  `, [start, end]);
  return rows;
}

const isoDate = date => (date ? moment(date).toISOString() : '');

// neutralise spreadsheet formula injection in free text (OWASP CSV injection)
const safeText = text => (text && /^[=+\-@\t\r]/.test(text) ? `'${text}` : (text || ''));

const applicationTypeOf = row => {
  if (row.case_action !== 'grant') {
    return row.case_action || '';
  }
  return row.model_status === 'active' ? 'amendment' : 'application';
};

const roleOf = profile => {
  if (!profile) {
    return '';
  }
  if (profile.asru_inspector) {
    return 'inspector';
  }
  if (profile.asru_licensing) {
    return 'licensing';
  }
  return profile.asru_user ? 'asru' : 'establishment';
};

function summariseComments(commentRows) {
  const byField = {};
  commentRows.forEach(row => {
    const key = row.field_key || '(unknown)';
    const entry = byField[key] = byField[key] || {
      section: row.section,
      subsection: row.subsection,
      question_label: row.question_label,
      field_key: key,
      comment_count: 0,
      new_inspector_comments: 0,
      previous_inspector_comments: 0,
      projects: new Set()
    };
    entry.comment_count += 1;
    if (row.inspector_cohort) {
      entry[`${row.inspector_cohort}_inspector_comments`] += 1;
    }
    entry.projects.add(row.project_id);
  });

  return Object.values(byField)
    .map(entry => ({ ...entry, projects: entry.projects.size }))
    .sort((a, b) => b.comment_count - a.comment_count);
}

const writeCsv = (name, rows) => new Promise((resolve, reject) => {
  const file = path.resolve(`${prefix}-${name}.csv`);
  fastCsv.writeToPath(file, rows, { headers: true })
    .on('error', reject)
    .on('finish', () => {
      console.log(`Wrote ${rows.length} rows to ${file}`);
      resolve();
    });
});

async function run() {
  const start = moment(startDate).startOf('day').toISOString();
  const end = moment(endDate).endOf('day').toISOString();
  console.log(`Reporting window: ${start} to ${end}, inspector cohort boundary: ${cohortDate}`);

  const questions = buildQuestionLookup();
  const [returns, comments] = await Promise.all([getReturns(start, end), getComments(start, end)]);

  const all = [...returns, ...comments];
  const profileIds = all.map(row => row.profile_id);
  const [projects, profiles, firstActivity] = await Promise.all([
    getProjects(all.map(row => row.project_id)),
    getProfiles(profileIds),
    getFirstActivity(profileIds)
  ]);

  // columns common to both exports, describing the project, case and the ASRU user involved
  const commonColumns = row => {
    const project = projects[row.project_id] || {};
    const profile = profiles[row.profile_id];
    const role = roleOf(profile);
    const firstSeen = firstActivity[row.profile_id]?.first_seen_at;
    const isAsru = role && role !== 'establishment';
    return {
      case_id: row.case_id,
      project_id: row.project_id,
      licence_number: project.licence_number || '',
      project_title: project.title || '',
      establishment: project.establishment || '',
      application_type: applicationTypeOf(row),
      date: isoDate(row.created_at),
      user: (profile && `${profile.first_name} ${profile.last_name}`.trim()) || row.name_snapshot || '',
      user_role: role,
      inspector_cohort: isAsru && firstSeen ? (moment(firstSeen).isBefore(cohortDate) ? 'previous' : 'new') : ''
    };
  };

  const returnRows = returns.map(row => ({
    ...commonColumns(row),
    return_number: Number(row.return_number),
    returned_from_status: row.returned_from_status,
    return_reason: safeText(row.return_reason)
  }));

  const commentRows = comments.map(row => {
    const question = resolveQuestion(row.field_key, questions);
    return {
      ...commonColumns(row),
      field_key: normaliseFieldKey(row.field_key),
      section: question.section,
      subsection: question.subsection,
      question_label: question.label,
      comment_text: safeText(row.comment_text)
    };
  });

  await Promise.all([
    writeCsv('return-reasons', returnRows),
    writeCsv('field-comments', commentRows),
    writeCsv('field-comment-counts', summariseComments(commentRows))
  ]);
}

run()
  .catch(error => {
    console.error('Export failed:', error);
    console.log('Usage: node scripts/ppl-returns-data-export.js --startDate=2024-09-01 --endDate=2026-09-01 --file=asl-5165');
    process.exitCode = 1;
  })
  .finally(() => Promise.all([knexTaskflow.destroy(), knexASL.destroy()]));
