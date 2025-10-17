const { pick } = require('lodash');
const { Transform } = require('stream');
const extractContent = require('./extract-content');
const extractSpecies = require('../projects/extract-species');
const deleteIndex = require('../utils/delete-index');
const logger = require('../../logger');

const indexName = 'projects-content';
const BATCH_SIZE = 100;

const columnsToIndex = [
  'id', 'title', 'status', 'licenceNumber', 'expiryDate', 'issueDate',
  'revocationDate', 'raDate', 'schemaVersion'
];

const ANALYSIS_SETTINGS = {
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
};

const FIELD_MAPPINGS = {
  title: { type: 'text', fields: { value: { type: 'keyword' } } },
  licenceNumber: { type: 'keyword', normalizer: 'licenceNumber', fields: { value: { type: 'keyword' } } },
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
  species: { type: 'keyword', normalizer: 'lowercase', fields: { value: { type: 'keyword' } } },
  purposes: { type: 'keyword', normalizer: 'lowercase', fields: { value: { type: 'keyword' } } },
  requiresRa: { type: 'boolean' },
  continuation: { type: 'boolean' }
};

function extractPurposes(data) {
  function normalise(value) {
    const vals = {
      'basic-research': 'a',
      'translational-research-1': 'b1',
      'translational-research-2': 'b2',
      'translational-research-3': 'b3',
      'safety-of-drugs': 'c',
      'protection-of-environment': 'd',
      'preservation-of-species': 'e',
      'forensic-enquiries': 'g',
      // legacy
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

    return vals[value];
  }

  if (data['training-licence']) {
    return 'f';
  }

  return [
    ...(data['permissible-purpose'] || []),
    ...(data['translational-research'] || []),
    // legacy
    ...(data.purpose || []),
    ...(data['purpose-b'] || [])
  ].filter(normalise).map(normalise);
}

async function resetIndex(esClient) {
  logger.info(`Rebuilding index ${indexName}`);
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
        pv.id as version_id,
        pv.status as version_status
      FROM project_versions pv
      WHERE pv.status IN ('submitted', 'granted')
        AND pv.status != 'draft'
      ORDER BY pv.project_id, pv.updated_at DESC
    )
    SELECT
      p.*,
      lv.data as version_data,
      lv.version_id,
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
        const protocols = (data.protocols || []).filter(p => p && !p.deleted).map(p => pick(p, 'title'));

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
          species: extractSpecies(data, project),
          purposes: extractPurposes(data),
          versionId: project.version_id,
          requiresRa: !!project.raDate,
          continuation: !!data.continuation || !!data['transfer-expiring'],
          protocols,
          content: extractContent(data, project)
        };

        callback(null, { id: project.id, document });
      } catch (error) {
        logger.error(`Failed to transform project ${project.id}:`, error.message);
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
          logger.error(`Batch had ${errors.length} indexing failures`);
        }
      }

      processedCount += currentBatch.length;
      if (processedCount % 1000 === 0) {
        logger.info(`Indexed ${processedCount} projects...`);
      }
    } catch (error) {
      logger.error('Failed to index batch:', error.message);
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
      logger.info(`Completed streaming ${processedCount} projects`);
      callback();
    }
  });
}

function createProgressCounter() {
  let projectCount = 0;
  let lastLogged = 0;

  return new Transform({
    objectMode: true,
    transform(data, encoding, callback) {
      projectCount++;

      if (projectCount - lastLogged >= 1000) {
        logger.info(`Streamed ${projectCount} projects from database...`);
        lastLogged = projectCount;
      }

      callback(null, data);
    },

    flush(callback) {
      logger.info(`Total projects processed: ${projectCount}`);
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

        logger.info('Indexing projects...');

        let totalStreamed = 0;

        const stream = streamProjectsWithVersions(Project, options);
        const progressCounter = createProgressCounter();
        const documentTransform = createDocumentTransform();
        const batchProcessor = createBatchProcessor(esClient);

        stream
          .on('data', () => {
            totalStreamed++;
          })
          .on('error', reject)
          .pipe(progressCounter)
          .on('error', reject)
          .pipe(documentTransform)
          .on('error', reject)
          .pipe(batchProcessor)
          .on('finish', async () => {
            try {
              logger.debug('All content streams finished, refreshing index...');
              await esClient.indices.refresh({ index: indexName });
              logger.info(`Content index refresh completed for ${totalStreamed} projects`);
              resolve(totalStreamed);
            } catch (error) {
              logger.error('Content index refresh failed:', error.message);
              logger.debug('Content refresh error details:', error);
              reject(error);
            }
          })
          .on('error', (error) => {
            logger.error('Content batch processor error:', error.message);
            logger.debug('Content batch processor error details:', error);
            reject(error);
          });
      })
      .catch(error => {
        logger.error('Content indexer initialization error:', error.message);
        logger.debug('Content initialization error details:', error);
        reject(error);
      });
  });
};
