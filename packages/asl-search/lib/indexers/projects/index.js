const { pick } = require('lodash');
const extractSpecies = require('./extract-species');
const deleteIndex = require('../utils/delete-index');

const indexName = 'projects';
const columnsToIndex = [
  'id',
  'title',
  'status',
  'licenceNumber',
  'issueDate',
  'expiryDate',
  'revocationDate',
  'raDate',
  'refusedDate',
  'suspendedDate',
  'isLegacyStub',
  'schemaVersion'
];

const ANALYSIS_SETTINGS = {
  analysis: {
    analyzer: {
      default: {
        tokenizer: 'whitespace',
        filter: ['lowercase', 'stop']
      }
    },
    normalizer: {
      licenceNumber: { type: 'custom', filter: ['lowercase'] },
      lowercase: { type: 'custom', filter: ['lowercase'] }
    }
  }
};

const FIELD_MAPPINGS = {
  title: { type: 'text', fields: { value: { type: 'keyword' } } },
  licenceNumber: { type: 'keyword', normalizer: 'licenceNumber', fields: { value: { type: 'keyword' } } },
  status: { type: 'keyword', fields: { value: { type: 'keyword' } } },
  species: { type: 'keyword', normalizer: 'lowercase', fields: { value: { type: 'keyword' } } },
  licenceHolder: {
    properties: {
      lastName: { type: 'text', fields: { value: { type: 'keyword' } } }
    }
  },
  establishment: {
    properties: {
      name: { type: 'text', fields: { value: { type: 'keyword' } } }
    }
  },
  issueDate: { type: 'date', fields: { value: { type: 'date' } } },
  expiryDate: { type: 'date', fields: { value: { type: 'date' } } },
  revocationDate: { type: 'date', fields: { value: { type: 'date' } } },
  raDate: { type: 'date', fields: { value: { type: 'date' } } },
  refusedDate: { type: 'date', fields: { value: { type: 'date' } } },
  suspendedDate: { type: 'date', fields: { value: { type: 'date' } } },
  endDate: { type: 'date', fields: { value: { type: 'date' } } }
};

function getEndDate(project) {
  const { status, expiryDate, revocationDate, transferredOutDate } = project;
  switch (status) {
    case 'active':
    case 'expired':
      return expiryDate;
    case 'revoked':
      return revocationDate;
    case 'transferred':
      return transferredOutDate;
    default:
      return null;
  }
}

async function resetIndex(esClient) {
  console.log(`Rebuilding index [${indexName}]...`);

  await deleteIndex(esClient, indexName);

  await esClient.indices.create({
    index: indexName,
    body: {
      settings: ANALYSIS_SETTINGS,
      mappings: { properties: FIELD_MAPPINGS }
    }
  });
}

async function buildProjectDocument(project, ProjectVersion) {
  const version = await ProjectVersion.query()
    .where({
      // look for most recent submitted draft for inactive projects
      status: project.status === 'inactive' ? 'submitted' : 'granted',
      projectId: project.id
    })
    .orderBy('updatedAt', 'desc')
    .first();

  const data = version.data ? version.data : {};
  const species = extractSpecies(data, project);

  return {
    ...pick(project, columnsToIndex),
    licenceNumber: project.licenceNumber ? project.licenceNumber.toUpperCase() : null,
    licenceHolder: pick(project.licenceHolder, ['id', 'firstName', 'lastName']),
    establishment: pick(project.establishment, ['id', 'name']),
    endDate: getEndDate(project),
    keywords: data.keywords,
    species
  };
}

async function indexProject(esClient, project, ProjectVersion) {
  try {
    const body = await buildProjectDocument(project, ProjectVersion);

    await esClient.index({
      index: indexName,
      id: project.id,
      body
    });
  } catch (error) {
    console.error(`Failed to index project ${project.id}:`, error.message);
  }
}

module.exports = async (db, esClient, options = {}) => {
  const { Project, ProjectVersion } = db;

  if (options.reset && options.id) {
    throw new Error('Do not define an ID when resetting indexes');
  }

  if (options.reset) {
    await resetIndex(esClient);
  }

  const query = Project.query()
    .select(columnsToIndex)
    .withGraphFetched('[licenceHolder, establishment]')
    .whereExists(Project.relatedQuery('version').where('status', '!=', 'draft'));

  if (options.id) {
    query.where({ id: options.id });
  }

  const projects = await query;

  console.log(`Indexing ${projects.length} projects...`);

  // Limit concurrency to avoid overwhelming ES and DB
  const concurrency = 10;
  for (let i = 0; i < projects.length; i += concurrency) {
    const batch = projects.slice(i, i + concurrency);
    await Promise.all(batch.map(p => indexProject(esClient, p, ProjectVersion)));
  }

  await esClient.indices.refresh({ index: indexName });
  console.log(`Indexed ${projects.length} projects`);
};
