const { pick } = require('lodash');
const { Transform } = require('stream');
const extractContent = require('./extract-content');
const extractSpecies = require('../projects/extract-species');
const deleteIndex = require('../utils/delete-index');
const logger = require('../../logger');

const indexName = 'projects-content';
const BATCH_SIZE = 500;

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
  logger.debug('Streaming projects with optimized query for content indexing');

  return Project.knex().raw(`
    SELECT
      p.id,
      p.title,
      p.status,
      p.licence_number as "licenceNumber",
      p.issue_date as "issueDate",
      p.expiry_date as "expiryDate",
      p.revocation_date as "revocationDate",
      p.ra_date as "raDate",
      p.schema_version as "schemaVersion",
      p.establishment_id as "establishmentId",
      p.licence_holder_id as "licenceHolderId",
      lv.data as "versionData",
      lv.id as "versionId",
      lv.status as "versionStatus",
      lh.first_name as "licenceHolderFirstName",
      lh.last_name as "licenceHolderLastName",
      e.name as "establishmentName",
      e.id as "establishmentJoinedId"
    FROM projects p
    LEFT JOIN establishments e ON p.establishment_id = e.id
    LEFT JOIN profiles lh ON p.licence_holder_id = lh.id
    JOIN LATERAL (
      SELECT pv.data, pv.id, pv.status
      FROM project_versions pv
      WHERE pv.project_id = p.id
        AND pv.deleted IS NULL
        AND pv.status = CASE
          WHEN p.status = 'inactive' THEN 'submitted'
          ELSE 'granted'
        END
      ORDER BY pv.updated_at DESC
      LIMIT 1
    ) lv ON TRUE
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
  let transformCount = 0;
  let lastLogTime = Date.now();

  // Helper function to get field with fallbacks
  const getField = (project, fieldName, fallbacks = []) => {
    const allNames = [fieldName, ...fallbacks];
    for (const name of allNames) {
      if (project[name] !== undefined && project[name] !== null) {
        return project[name];
      }
    }
    return null;
  };

  return new Transform({
    objectMode: true,
    highWaterMark: 1000,

    transform(project, encoding, callback) {
      try {
        transformCount++;

        if (transformCount % 50000 === 0) {
          const now = Date.now();
          const rate = 50000 / ((now - lastLogTime) / 1000);
          logger.info(`Transformed ${transformCount.toLocaleString()} projects (${Math.round(rate)}/sec)`);
          lastLogTime = now;
        }

        const establishmentId = getField(project, 'establishmentId', ['establishmentIdJoined']);
        const licenceHolderId = getField(project, 'licenceHolderId');

        if (!establishmentId) {
          if (transformCount <= 10) {
            logger.warn(`Project ${project.id} missing establishment ID`);
          }
          callback();
          return;
        }

        if (!licenceHolderId) {
          logger.warn(`Project ${project.id} missing licence holder ID - skipping`);
          callback();
          return;
        }

        // Extract data with proper fallbacks
        const versionData = getField(project, 'versionData', ['version_data']) || {};
        const versionId = getField(project, 'versionId');
        const establishmentName = getField(project, 'establishmentName', ['establishment_name']);
        const licenceHolderFirstName = getField(project, 'licenceHolderFirstName', ['licence_holder_first_name']);
        const licenceHolderLastName = getField(project, 'licenceHolderLastName', ['licence_holder_last_name']);

        const protocols = (versionData.protocols || []).filter(p => p && !p.deleted).map(p => pick(p, 'title'));

        // Create document
        const document = {
          ...pick(project, columnsToIndex),
          licenceNumber: project.licenceNumber ? project.licenceNumber.toUpperCase() : null,
          licenceHolder: {
            id: licenceHolderId,
            firstName: licenceHolderFirstName,
            lastName: licenceHolderLastName
          },
          establishment: {
            id: establishmentId,
            name: establishmentName
          },
          species: extractSpecies(versionData, project),
          purposes: extractPurposes(versionData),
          versionId: versionId,
          requiresRa: !!project.raDate,
          continuation: !!versionData.continuation || !!versionData['transfer-expiring'],
          protocols,
          content: extractContent(versionData, project)
        };

        // Progress logging
        if (transformCount % 10000 === 0) {
          logger.debug(`Transformed ${transformCount.toLocaleString()} projects`);
        }

        callback(null, { id: project.id, document });

      } catch (error) {
        logger.error(`Failed to transform project ${project.id}: ${error.message ?? JSON.stringify(error)}`, error);
        // Don't re-throw, just skip this project and continue
        callback();
      }
    },

    flush(callback) {
      logger.debug(`Document transform completed: ${transformCount} projects processed`);
      callback();
    }
  });
}

function createBatchProcessor(esClient) {
  let batch = [];
  let processedCount = 0;
  let lastLogged = 0;

  const processBatch = async () => {
    if (batch.length === 0) return;

    const currentBatch = [...batch];
    batch = [];

    try {
      const body = currentBatch.flatMap(({ id, document }) => [
        { index: { _index: indexName, _id: id } },
        document
      ]);

      const response = await esClient.bulk({
        refresh: false,
        body,
        timeout: '5m'
      });

      if (response.errors) {
        const errors = response.items.filter(item => item.index.error);
        if (errors.length > 0) {
          logger.error(`Batch had ${errors.length} indexing failures`);
        }
      }

      processedCount += currentBatch.length;

      // Progress logging for large datasets
      if (processedCount - lastLogged >= 10000 || processedCount % 5000 === 0) {
        logger.info(`Indexed ${processedCount.toLocaleString()} projects...`);
        lastLogged = processedCount;
      }
    } catch (error) {
      logger.error(`Failed to index batch: ${error.message ?? JSON.stringify(error)}`, error);
    }
  };

  return new Transform({
    objectMode: true,
    highWaterMark: BATCH_SIZE * 2,

    async transform(doc, encoding, callback) {
      batch.push(doc);

      if (batch.length >= BATCH_SIZE) {
        await processBatch();
      }

      callback();
    },

    async flush(callback) {
      logger.info(`Final batch processing with ${batch.length} documents`);
      await processBatch();
      logger.info(`Completed streaming ${processedCount.toLocaleString()} projects`);
      callback();
    }
  });
}

module.exports = async (db, esClient, options = {}) => {
  const { Project } = db;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  try {
    if (options.reset) {
      await resetIndex(esClient);
    }

    return new Promise((resolve, reject) => {
      let totalStreamed = 0;

      const stream = streamProjectsWithVersions(Project, options);
      const documentTransform = createDocumentTransform();
      const batchProcessor = createBatchProcessor(esClient);

      stream
        .on('data', () => {
          totalStreamed++;
          if (totalStreamed % 10000 === 0) {
            logger.info(`Streamed ${totalStreamed.toLocaleString()} projects from database...`);
          }
        })
        .on('error', reject)
        .pipe(documentTransform)
        .on('error', reject)
        .pipe(batchProcessor)
        .on('finish', async () => {
          try {
            await esClient.indices.refresh({ index: indexName });
            logger.info(`Content index refresh completed for ${totalStreamed.toLocaleString()} projects`);
            resolve(totalStreamed);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });

  } catch (error) {
    logger.error(`Failed to index projects content: ${error.message ?? JSON.stringify(error)}`, error);
    throw error;
  }
};
