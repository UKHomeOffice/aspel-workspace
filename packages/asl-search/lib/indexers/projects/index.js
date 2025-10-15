const { pick } = require('lodash');
const { Transform } = require('stream');
const extractSpecies = require('./extract-species');
const deleteIndex = require('../utils/delete-index');

const indexName = 'projects';
const BATCH_SIZE = 100;

const columnsToIndex = [
  'id', 'title', 'status', 'licenceNumber', 'issueDate', 'expiryDate',
  'revocationDate', 'raDate', 'refusedDate', 'suspendedDate', 'isLegacyStub', 'schemaVersion'
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
  console.log(`Rebuilding index ${indexName}`);
  await deleteIndex(esClient, indexName);

  await esClient.indices.create({
    index: indexName,
    body: {
      settings: ANALYSIS_SETTINGS,
      mappings: { properties: FIELD_MAPPINGS }
    }
  });
}

function streamProjectsWithVersions(Project, options = {}) {
  return Project.knex().raw(`
    WITH latest_versions AS (
      SELECT DISTINCT ON (pv.project_id)
        pv.project_id,
        pv.data,
        pv.status as version_status
      FROM project_versions pv
      WHERE pv.status IN ('submitted', 'granted')
        AND pv.status != 'draft'
      ORDER BY pv.project_id, pv.updated_at DESC
    )
    SELECT
      p.*,
      lv.data as version_data,
      lh.first_name as licence_holder_first_name,
      lh.last_name as licence_holder_last_name,
      e.name as establishment_name,
      e.id as establishment_id
    FROM projects p
    LEFT JOIN latest_versions lv ON p.id = lv.project_id
    LEFT JOIN profiles lh ON p.licence_holder_id = lh.id
    LEFT JOIN establishments e ON p.establishment_id = e.id
    WHERE p.deleted IS NULL
    AND EXISTS (
      SELECT 1 FROM project_versions pv2
      WHERE pv2.project_id = p.id
      AND pv2.status IN ('submitted', 'granted')
      AND pv2.status != 'draft'
    )
    ${options.id ? 'AND p.id = ?' : ''}
    ORDER BY p.id
  `, options.id ? [options.id] : []).stream();
}

function createDocumentTransform() {
  return new Transform({
    objectMode: true,
    transform(project, encoding, callback) {
      try {
        const data = project.version_data ? project.version_data : {};
        const species = extractSpecies(data, project);

        const document = {
          ...pick(project, columnsToIndex),
          licenceNumber: project.licenceNumber ? project.licenceNumber.toUpperCase() : null,
          licenceHolder: {
            id: project.licence_holder_id,
            firstName: project.licence_holder_first_name,
            lastName: project.licence_holder_last_name
          },
          establishment: {
            id: project.establishment_id,
            name: project.establishment_name
          },
          endDate: getEndDate(project),
          keywords: data.keywords,
          species
        };

        callback(null, { id: project.id, document });
      } catch (error) {
        console.error(`Failed to transform project ${project.id}:`, error.message);
        callback();
      }
    }
  });
}

function createBatchProcessor(esClient) {
  let batch = [];
  let processedCount = 0;

  const processBatch = async () => {
    if (batch.length === 0) return;

    const currentBatch = [...batch];
    batch = [];

    try {
      const body = currentBatch.flatMap(({ id, document }) => [
        { index: { _index: indexName, _id: id } },
        document
      ]);

      const response = await esClient.bulk({ refresh: false, body });

      if (response.errors) {
        const errors = response.items.filter(item => item.index.error);
        if (errors.length > 0) {
          console.error(`Batch had ${errors.length} indexing failures`);
        }
      }

      processedCount += currentBatch.length;
      if (processedCount % 1000 === 0) {
        console.log(`Indexed ${processedCount} projects...`);
      }
    } catch (error) {
      console.error('Failed to index batch:', error.message);
    }
  };

  return new Transform({
    objectMode: true,
    async transform(doc, encoding, callback) {
      batch.push(doc);

      if (batch.length >= BATCH_SIZE) {
        await processBatch();
      }

      callback();
    },

    async flush(callback) {
      await processBatch();
      console.log(`Completed streaming ${processedCount} projects`);
      callback();
    }
  });
}

module.exports = (db, esClient, options = {}) => {
  const { Project } = db;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(async () => {
        if (options.reset) {
          await resetIndex(esClient);
        }

        console.log('Streaming projects with optimized query...');

        let totalStreamed = 0;

        const stream = streamProjectsWithVersions(Project, options);
        const documentTransform = createDocumentTransform();
        const batchProcessor = createBatchProcessor(esClient);

        stream
          .on('data', () => {
            totalStreamed++;
            if (totalStreamed % 1000 === 0) {
              console.log(`Streamed ${totalStreamed} projects from database...`);
            }
          })
          .on('error', reject)
          .pipe(documentTransform)
          .on('error', reject)
          .pipe(batchProcessor)
          .on('finish', async () => {
            try {
              await esClient.indices.refresh({ index: indexName });
              console.log(`Index refresh completed for ${totalStreamed} projects`);
              resolve(totalStreamed);
            } catch (error) {
              reject(error);
            }
          })
          .on('error', reject);
      })
      .catch(reject);
  });
};
