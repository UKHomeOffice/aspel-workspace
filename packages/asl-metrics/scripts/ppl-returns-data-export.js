/**
 * ASL-5165 - Project licence data insights: reasons for return.
 *
 * Exports three CSVs covering PPL (project) applications:
 *
 *   1. <prefix>-return-reasons.csv      - every "returned to applicant" event on a project case,
 *                                         with the free text reason the reviewer supplied.
 *   2. <prefix>-field-comments.csv      - every comment left against an individual field of a PPL
 *                                         application, resolved to the question it relates to.
 *   3. <prefix>-field-comment-counts.csv - aggregate of (2), most commented-on question first.
 *
 * Usage:
 *   node scripts/ppl-returns-data-export.js [--startDate=YYYY-MM-DD] [--endDate=YYYY-MM-DD]
 *                                           [--file=prefix] [--cohortDate=YYYY-MM-DD]
 *
 * Options:
 *   --startDate   Start of the reporting window. Defaults to two years before today.
 *   --endDate     End of the reporting window. Defaults to today.
 *   --file        Output file prefix. Defaults to "ppl-returns".
 *   --cohortDate  Inspectors whose first ASRU status change is on/after this date are labelled as the
 *                 new intake in the `inspector_cohort` column. Defaults to 2025-10-01.
 *
 * Requires the same DATABASE_* / ASL_DATABASE_* environment variables as the metrics service.
 */

require('@asl/service/lib/register'); // required to transpile imports from @asl/projects

const fs = require('fs');
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

const BATCH_SIZE = 100;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Some schema labels are functions of the project values (e.g. wording differs for training
 * licences). Evaluate them against an empty project to recover the default wording.
 */
function resolveLabel(label) {
  if (typeof label === 'string') {
    return label;
  }
  if (typeof label !== 'function') {
    return '';
  }
  try {
    const resolved = label({}, {}, {});
    return typeof resolved === 'string' ? resolved : '';
  } catch (error) {
    return '';
  }
}

/**
 * Walks the PPL application schema and builds lookups of field name -> question label / location.
 * Comment field keys are dotted paths (e.g. `protocols.<uuid>.title`) whose final segment is the
 * field name used in the schema. Protocol questions are kept in their own lookup because several
 * names (`title`, `objectives`, `experience`) exist both inside and outside a protocol.
 */
function buildQuestionMetadataLookup() {
  const generalQuestionMetadata = {};
  const protocolQuestionMetadata = {};

  const recordQuestionMetadata = (metadataByFieldKey, fieldKey, questionLabel, hasQuestionLabel, sectionTitle, subsectionTitle) => {
    const existing = metadataByFieldKey[fieldKey];
    // a question label always beats a fallback title, otherwise first definition wins
    if (existing && (existing.hasQuestionLabel || !hasQuestionLabel)) {
      return;
    }
    metadataByFieldKey[fieldKey] = {
      label: questionLabel || '',
      hasQuestionLabel,
      section: sectionTitle || '',
      subsection: subsectionTitle || ''
    };
  };

  const collectQuestionMetadata = (metadataByFieldKey, schemaNode, parentFieldKey, sectionTitle, subsectionTitle, visitedNodes) => {
    if (!schemaNode || typeof schemaNode !== 'object' || visitedNodes.has(schemaNode)) {
      return;
    }
    visitedNodes.add(schemaNode);

    if (Array.isArray(schemaNode)) {
      schemaNode.forEach(childNode => collectQuestionMetadata(metadataByFieldKey, childNode, parentFieldKey, sectionTitle, subsectionTitle, visitedNodes));
      return;
    }

    if (typeof schemaNode.name === 'string') {
      const resolvedLabel = resolveLabel(schemaNode.label);
      const hasQuestionLabel = Boolean(resolvedLabel);
      const questionLabel = resolvedLabel || schemaNode.title;
      if (typeof questionLabel === 'string' && questionLabel) {
        recordQuestionMetadata(metadataByFieldKey, schemaNode.name, questionLabel, hasQuestionLabel, sectionTitle, subsectionTitle);
        recordQuestionMetadata(metadataByFieldKey, `${parentFieldKey}.${schemaNode.name}`, questionLabel, hasQuestionLabel, sectionTitle, subsectionTitle);
      }
    }

    Object.keys(schemaNode).forEach(propertyName => {
      if (typeof schemaNode[propertyName] === 'function') {
        return;
      }
      collectQuestionMetadata(metadataByFieldKey, schemaNode[propertyName], parentFieldKey, sectionTitle, subsectionTitle, visitedNodes);
    });
  };

  let projectSchema;
  let protocolSchemaSections;
  try {
    projectSchema = require('@asl/projects/client/schema/v1').default();
    protocolSchemaSections = require('@asl/projects/client/schema/v1/protocols').default;
  } catch (error) {
    console.warn(`Could not load the PPL schema, question labels will be blank: ${error.message}`);
    return { general: generalQuestionMetadata, protocol: protocolQuestionMetadata };
  }

  Object.entries(projectSchema).forEach(([sectionKey, sectionDefinition]) => {
    const sectionTitle = sectionDefinition.title || '';
    // protocol questions go into their own lookup - several names (`title`, `objectives`,
    // `experience`) exist both inside and outside a protocol
    const metadataByFieldKey = sectionKey === 'protocols' ? protocolQuestionMetadata : generalQuestionMetadata;
    Object.entries(sectionDefinition.subsections || {}).forEach(([subsectionKey, subsectionDefinition]) => {
      collectQuestionMetadata(metadataByFieldKey, subsectionDefinition, subsectionKey, sectionTitle, subsectionDefinition.title || '', new WeakSet());
      recordQuestionMetadata(metadataByFieldKey, subsectionKey, subsectionDefinition.title, false, sectionTitle, subsectionDefinition.title);
    });
  });

  Object.entries(protocolSchemaSections || {}).forEach(([subsectionKey, subsectionDefinition]) => {
    collectQuestionMetadata(protocolQuestionMetadata, subsectionDefinition, subsectionKey, 'Protocols', subsectionDefinition.title || '', new WeakSet());
    recordQuestionMetadata(protocolQuestionMetadata, subsectionKey, subsectionDefinition.title, false, 'Protocols', subsectionDefinition.title);
  });

  // protocol-level keys rendered by the repeater rather than declared as schema fields
  protocolQuestionMetadata.title = { label: 'Protocol title', hasQuestionLabel: true, section: 'Protocols', subsection: 'Protocol details' };

  return { general: generalQuestionMetadata, protocol: protocolQuestionMetadata };
}

const normaliseFieldKey = fieldKey => {
  if (!fieldKey) {
    return '';
  }
  return fieldKey
    .split('.')
    .map(segment => (UUID.test(segment) || /^\d+$/.test(segment) ? '*' : segment))
    .join('.');
};

const fieldPathOf = fieldKey => (fieldKey || '').split('.').filter(s => s && !UUID.test(s) && !/^\d+$/.test(s));

/**
 * Resolves a comment's dotted field key to a question, preferring the most specific match.
 * `protocols.<uuid>.steps.<uuid>.title` is tried as `steps.title` before bare `title`.
 */
function resolveField(fieldKey, questionMetadata) {
  const fieldPath = fieldPathOf(fieldKey);
  const inProtocol = fieldPath[0] === 'protocols';
  const lookups = inProtocol ? [questionMetadata.protocol, questionMetadata.general] : [questionMetadata.general];
  const segments = inProtocol ? fieldPath.slice(1) : fieldPath;
  const candidates = [segments.slice(-2).join('.'), segments.slice(-1).join('.')].filter(Boolean);

  for (const lookup of lookups) {
    for (const candidate of candidates) {
      if (lookup[candidate]) {
        return lookup[candidate];
      }
    }
  }
  return {};
}

function getOutputStream(name) {
  const fileName = `${prefix}-${name}.csv`;
  console.log(`Writing ${path.resolve(fileName)}`);
  return fs.createWriteStream(fileName);
}

function writeCsv(name, rows) {
  return new Promise((resolve, reject) => {
    const stream = fastCsv.format({ headers: true });
    const out = getOutputStream(name);
    out.on('error', reject);
    out.on('finish', () => resolve(rows.length));
    stream.pipe(out);
    rows.forEach(row => stream.write(row));
    stream.end();
  });
}

async function batchLookup(table, columns, ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  const results = [];
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = await knexASL(table).select(columns).whereIn('id', unique.slice(i, i + BATCH_SIZE));
    results.push(...batch);
  }
  return results.reduce((acc, row) => ({ ...acc, [row.id]: row }), {});
}

async function getProfiles(ids) {
  return batchLookup('profiles', ['id', 'first_name', 'last_name', 'asru_user', 'asru_inspector', 'asru_licensing'], ids);
}

async function getProjects(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  const results = [];
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = await knexASL('projects')
      .select(
        'projects.id',
        'projects.title',
        'projects.licence_number',
        'projects.status',
        'establishments.name as establishment',
        'profiles.first_name as holder_first_name',
        'profiles.last_name as holder_last_name'
      )
      .leftJoin('establishments', 'projects.establishment_id', 'establishments.id')
      .leftJoin('profiles', 'projects.licence_holder_id', 'profiles.id')
      .whereIn('projects.id', unique.slice(i, i + BATCH_SIZE));
    results.push(...batch);
  }
  return results.reduce((acc, row) => ({ ...acc, [row.id]: row }), {});
}

const fullName = profile => (profile ? `${profile.first_name} ${profile.last_name}`.trim() : '');

const periodOf = date => (moment(date).isBefore(cohortDate) ? `before ${cohortDate}` : `from ${cohortDate}`);

const isoDate = date => (date ? moment(date).toISOString() : '');

// neutralise spreadsheet formula injection in free text (OWASP CSV injection)
const safeText = text => (text && /^[=+\-@\t\r]/.test(text) ? `'${text}` : (text || ''));

const applicationTypeOf = row => {
  if (row.case_action !== 'grant') {
    return row.case_action || '';
  }
  return row.model_status === 'active' ? 'amendment' : 'application';
};

function roleOf(profile) {
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
}

async function fetchReturnReasons(start, end) {
  // number returns across the case's full history, then apply the reporting window
  const { rows } = await knexTaskflow.raw(`
    SELECT * FROM (
      SELECT
        c.id AS case_id,
        c.data->>'id' AS project_id,
        c.data->>'action' AS case_action,
        c.data->'modelData'->>'status' AS model_status,
        c.status AS case_status_now,
        al.id AS activity_id,
        al.created_at AS returned_at,
        SPLIT_PART(al.event_name, ':', 2) AS returned_from_status,
        al.changed_by AS returned_by_profile_id,
        al.event->'meta'->'user'->'profile'->>'name' AS returned_by_name_snapshot,
        al.comment AS return_reason,
        ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY al.created_at) AS return_number
      FROM cases c
      INNER JOIN activity_log al ON al.case_id = c.id
      WHERE c.data->>'model' = 'project'
        AND al.event_name LIKE 'status:%:returned-to-applicant'
    ) r
    WHERE r.returned_at BETWEEN ? AND ?
    ORDER BY r.returned_at
  `, [start, end]);

  return rows;
}

// first status change made by each profile on any task - a proxy for when an inspector started
async function fetchFirstActivity(profileIds) {
  const unique = [...new Set(profileIds.filter(Boolean))];
  const result = {};
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = await knexTaskflow('activity_log')
      .select('changed_by')
      .min('created_at as first_seen_at')
      .whereIn('changed_by', unique.slice(i, i + BATCH_SIZE))
      .where('event_name', 'like', 'status:%')
      .groupBy('changed_by');
    batch.forEach(row => { result[row.changed_by] = row.first_seen_at; });
  }
  return result;
}

async function fetchFieldComments(start, end) {
  const { rows } = await knexTaskflow.raw(`
    WITH latest_updates AS (
      SELECT DISTINCT ON (al.event->'meta'->>'id')
        al.event->'meta'->>'id' AS comment_id,
        al.comment AS comment,
        al.created_at AS updated_at
      FROM activity_log al
      WHERE al.event_name = 'update-comment'
      ORDER BY al.event->'meta'->>'id', al.created_at DESC
    ),
    deletions AS (
      SELECT DISTINCT al.event->'meta'->>'id' AS comment_id
      FROM activity_log al
      WHERE al.event_name = 'delete-comment'
    )
    SELECT
      c.id AS case_id,
      c.data->>'id' AS project_id,
      c.data->>'action' AS case_action,
      c.data->'modelData'->>'status' AS model_status,
      al.id AS comment_id,
      al.created_at AS commented_at,
      al.changed_by AS author_profile_id,
      al.event->'meta'->'user'->'profile'->>'name' AS author_name_snapshot,
      al.event->'meta'->'payload'->'meta'->>'field' AS field_key,
      al.event->'meta'->'payload'->'meta'->>'versionId' AS version_id,
      COALESCE(u.comment, al.comment) AS comment_text,
      (u.comment_id IS NOT NULL) AS was_edited,
      (d.comment_id IS NOT NULL) AS was_deleted
    FROM cases c
    INNER JOIN activity_log al ON al.case_id = c.id
    LEFT JOIN latest_updates u ON u.comment_id = al.id::text
    LEFT JOIN deletions d ON d.comment_id = al.id::text
    WHERE c.data->>'model' = 'project'
      AND al.event_name = 'comment'
      AND al.created_at BETWEEN ? AND ?
    ORDER BY al.created_at
  `, [start, end]);

  return rows;
}

function summariseComments(commentRows) {
  const byField = commentRows.reduce((acc, row) => {
    const key = row.field_key_normalised || '(unknown)';
    acc[key] = acc[key] || {
      field_key_normalised: key,
      field_name: row.field_name,
      section: row.section,
      subsection: row.subsection,
      question_label: row.question_label,
      comment_count: 0,
      active_comment_count: 0,
      new_inspector_count: 0,
      previous_inspector_count: 0,
      distinct_projects: new Set(),
      distinct_cases: new Set(),
      distinct_authors: new Set(),
      first_comment_at: row.commented_at,
      last_comment_at: row.commented_at
    };
    const entry = acc[key];
    entry.comment_count += 1;
    if (!row.was_deleted) {
      entry.active_comment_count += 1;
    }
    if (row.inspector_cohort === 'new') {
      entry.new_inspector_count += 1;
    } else if (row.inspector_cohort === 'previous') {
      entry.previous_inspector_count += 1;
    }
    entry.distinct_projects.add(row.project_id);
    entry.distinct_cases.add(row.case_id);
    entry.distinct_authors.add(row.author_profile_id);
    if (row.commented_at < entry.first_comment_at) {
      entry.first_comment_at = row.commented_at;
    }
    if (row.commented_at > entry.last_comment_at) {
      entry.last_comment_at = row.commented_at;
    }
    return acc;
  }, {});

  return Object.values(byField)
    .map(entry => ({
      ...entry,
      distinct_projects: entry.distinct_projects.size,
      distinct_cases: entry.distinct_cases.size,
      distinct_authors: entry.distinct_authors.size,
      first_comment_at: isoDate(entry.first_comment_at),
      last_comment_at: isoDate(entry.last_comment_at)
    }))
    .sort((a, b) => b.comment_count - a.comment_count);
}

async function run() {
  const start = moment(startDate).startOf('day').toISOString();
  const end = moment(endDate).endOf('day').toISOString();

  console.log(`Reporting window: ${start} to ${end}`);
  console.log(`Cohort boundary: ${cohortDate}`);

  const questionMetadata = buildQuestionMetadataLookup();
  console.log(`Loaded ${Object.keys(questionMetadata.general).length + Object.keys(questionMetadata.protocol).length} question labels from the PPL schema`);

  const [returns, comments] = await Promise.all([
    fetchReturnReasons(start, end),
    fetchFieldComments(start, end)
  ]);

  const projects = await getProjects([...returns, ...comments].map(r => r.project_id));
  const profileIds = [
    ...returns.map(r => r.returned_by_profile_id),
    ...comments.map(r => r.author_profile_id)
  ];
  const profiles = await getProfiles(profileIds);
  const firstActivity = await fetchFirstActivity(profileIds);

  const inspectorColumns = (profileId, profile) => {
    const firstSeen = firstActivity[profileId];
    const isAsru = profile && (profile.asru_user || profile.asru_inspector || profile.asru_licensing);
    return {
      inspector_first_activity_at: isAsru ? isoDate(firstSeen) : '',
      inspector_cohort: isAsru && firstSeen
        ? (moment(firstSeen).isBefore(cohortDate) ? 'previous' : 'new')
        : ''
    };
  };

  const projectColumns = projectId => {
    const project = projects[projectId] || {};
    return {
      project_id: projectId,
      licence_number: project.licence_number || '',
      project_title: project.title || '',
      establishment: project.establishment || '',
      licence_holder: `${project.holder_first_name || ''} ${project.holder_last_name || ''}`.trim(),
      project_status: project.status || ''
    };
  };

  const returnRows = returns.map(row => {
    const profile = profiles[row.returned_by_profile_id];
    return {
      case_id: row.case_id,
      ...projectColumns(row.project_id),
      case_action: row.case_action,
      application_type: applicationTypeOf(row),
      case_status_now: row.case_status_now,
      returned_at: isoDate(row.returned_at),
      period: periodOf(row.returned_at),
      return_number: Number(row.return_number),
      returned_from_status: row.returned_from_status,
      returned_by: fullName(profile) || row.returned_by_name_snapshot || '',
      returned_by_profile_id: row.returned_by_profile_id || '',
      returned_by_role: roleOf(profile),
      ...inspectorColumns(row.returned_by_profile_id, profile),
      return_reason: safeText(row.return_reason)
    };
  });

  const commentRows = comments.map(row => {
    const profile = profiles[row.author_profile_id];
    const fieldKey = row.field_key || '';
    const fieldPath = fieldPathOf(fieldKey);
    const meta = resolveField(fieldKey, questionMetadata);
    return {
      case_id: row.case_id,
      ...projectColumns(row.project_id),
      case_action: row.case_action,
      application_type: applicationTypeOf(row),
      version_id: row.version_id || '',
      comment_id: row.comment_id,
      commented_at: isoDate(row.commented_at),
      period: periodOf(row.commented_at),
      top_level_section: fieldKey.split('.')[0] || '',
      field_key: fieldKey,
      field_key_normalised: normaliseFieldKey(fieldKey),
      field_name: fieldPath[fieldPath.length - 1] || '',
      section: meta.section || '',
      subsection: meta.subsection || '',
      question_label: meta.label || '',
      // deleted comments are hidden in the service, so don't export their text
      comment_text: row.was_deleted ? '' : safeText(row.comment_text),
      was_edited: !!row.was_edited,
      was_deleted: !!row.was_deleted,
      author: fullName(profile) || row.author_name_snapshot || '',
      author_profile_id: row.author_profile_id || '',
      author_role: roleOf(profile),
      ...inspectorColumns(row.author_profile_id, profile)
    };
  });

  const counts = summariseComments(commentRows);

  const written = await Promise.all([
    writeCsv('return-reasons', returnRows),
    writeCsv('field-comments', commentRows),
    writeCsv('field-comment-counts', counts)
  ]);

  console.log(`Return reasons: ${written[0]} rows`);
  console.log(`Field comments: ${written[1]} rows`);
  console.log(`Commented-on questions: ${written[2]} rows`);
}

run()
  .catch(error => {
    console.error('Export failed:', error);
    console.log('Usage: node scripts/ppl-returns-data-export.js --startDate=2023-09-01 --endDate=2025-09-30 --file=asl-5165');
    process.exitCode = 1;
  })
  .finally(() => Promise.all([knexTaskflow.destroy(), knexASL.destroy()]));
