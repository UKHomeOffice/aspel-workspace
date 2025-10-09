const { pick } = require('lodash');
const extractContent = require('./extract-content');
const extractSpecies = require('../projects/extract-species');
const deleteIndex = require('../utils/delete-index');

const indexName = 'projects-content';

const columnsToIndex = [
  'id',
  'title',
  'status',
  'licenceNumber',
  'expiryDate',
  'issueDate',
  'revocationDate',
  'raDate',
  'schemaVersion'
];

// Normalise permissible purpose values
function extractPurposes(data) {
  const purposeMap = {
    'basic-research': 'a',
    'translational-research-1': 'b1',
    'translational-research-2': 'b2',
    'translational-research-3': 'b3',
    'safety-of-drugs': 'c',
    'protection-of-environment': 'd',
    'preservation-of-species': 'e',
    'forensic-enquiries': 'g',
    // legacy mappings
    'purpose-a': 'a',
    'purpose-b1': 'b1',
    'purpose-b2': 'b2',
    'purpose-b3': 'b3',
    'purpose-c': 'c',
    'purpose-d': 'd',
    'purpose-e': 'e',
    'purpose-f': 'f',
    'purpose-g': 'g'
  };

  const normalise = val => purposeMap[val];

  if (data['training-licence']) {
    return ['f'];
  }

  const allPurposes = [
    ...(data['permissible-purpose'] || []),
    ...(data['translational-research'] || []),
    ...(data.purpose || []), // legacy
    ...(data['purpose-b'] || [])
  ];

  return allPurposes.map(normalise).filter(Boolean);
}

async function indexProject(esClient, project, ProjectVersion) {
  try {
    const version = await ProjectVersion.query()
      .where({
        projectId: project.id,
        status: project.status === 'inactive' ? 'submitted' : 'granted'
      })
      .orderBy('updatedAt', 'desc')
      .first();

    const versionData = version.data ? version.data : {};
    const protocols = (versionData.protocols || [])
      .filter(p => p && !p.deleted)
      .map(p => pick(p, 'title'));

    const licenceNumber = project.licenceNumber
      ? project.licenceNumber.toUpperCase()
      : null;

    if (!licenceNumber) {
      console.warn(`Project ${project.id} has null or missing licenceNumber`);
    }

    const body = {
      ...pick(project, columnsToIndex),
      licenceNumber,
      licenceHolder: pick(project.licenceHolder, ['id', 'firstName', 'lastName']),
      establishment: pick(project.establishment, ['id', 'name']),
      species: extractSpecies(versionData, project),
      purposes: extractPurposes(versionData),
      versionId: version.id ? version.id : null,
      requiresRa: Boolean(project.raDate),
      continuation: Boolean(versionData.continuation || versionData['transfer-expiring']),
      protocols,
      content: extractContent(versionData, project)
    };

    await esClient.index({
      index: indexName,
      id: project.id,
      body
    });
  } catch (err) {
    console.error(`Failed to index project ${project.id}: ${err.message}`);
  }
}

async function resetIndex(esClient) {
  console.log(`Rebuilding index: ${indexName}`);

  await deleteIndex(esClient, indexName);

  await esClient.indices.create({
    index: indexName,
    body: {
      settings: {
        analysis: {
          analyzer: {
            default: {
              tokenizer: 'standard',
              filter: ['lowercase', 'stop']
            }
          },
          normalizer: {
            licenceNumber: { type: 'custom', filter: ['lowercase'] },
            lowercase: { type: 'custom', filter: ['lowercase'] }
          }
        }
      },
      mappings: {
        properties: {
          title: { type: 'text', fields: { value: { type: 'keyword' } } },
          licenceNumber: {
            type: 'keyword',
            normalizer: 'licenceNumber',
            fields: { value: { type: 'keyword' } }
          },
          status: { type: 'keyword', fields: { value: { type: 'keyword' } } },
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
          expiryDate: { type: 'date', fields: { value: { type: 'date' } } },
          raDate: { type: 'date', fields: { value: { type: 'date' } } },
          species: {
            type: 'keyword',
            normalizer: 'lowercase',
            fields: { value: { type: 'keyword' } }
          },
          purposes: {
            type: 'keyword',
            normalizer: 'lowercase',
            fields: { value: { type: 'keyword' } }
          },
          requiresRa: { type: 'boolean' },
          continuation: { type: 'boolean' }
        }
      }
    }
  });
}

module.exports = async (db, esClient, options = {}) => {
  const { Project, ProjectVersion } = db;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  if (options.reset) {
    await resetIndex(esClient);
  }

  const projectsQuery = Project.query()
    .select(columnsToIndex)
    .where(builder => {
      if (options.id) {
        builder.where({ id: options.id });
      }
    })
    .withGraphFetched('[licenceHolder, establishment]')
    .whereExists(Project.relatedQuery('version').where('status', '!=', 'draft'));

  const projects = await projectsQuery;
  console.log(`Indexing ${projects.length} projects...`);

  for (const project of projects) {
    await indexProject(esClient, project, ProjectVersion);
  }

  await esClient.indices.refresh({ index: indexName });
  console.log(`Indexing completed for ${projects.length} projects`);
};
