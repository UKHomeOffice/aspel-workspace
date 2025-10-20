const { pick } = require('lodash');
const deleteIndex = require('../utils/delete-index');
const logger = require('../../logger');

const indexName = 'enforcements';
const columnsToIndex = ['id', 'caseNumber', 'createdAt', 'updatedAt'];

const indexEnforcement = async (esClient, enforcement) => {
  return esClient.index({
    index: indexName,
    id: enforcement.id,
    body: {
      ...pick(enforcement, columnsToIndex),
      subjects: enforcement.subjects.map(subject => {
        return {
          profile: subject.profile,
          establishment: subject.establishment.name,
          establishmentKeywords: subject.establishment.keywords,
          flags: subject.flags
        };
      })
    }
  });
};

const reset = async (esClient) => {
  logger.info(`Rebuilding index ${indexName}`);
  await deleteIndex(esClient, indexName);

  await esClient.indices.create({
    index: indexName,
    body: {
      settings: {
        analysis: {
          analyzer: {
            default: {
              tokenizer: 'whitespace',
              filter: ['lowercase', 'stop']
            }
          }
        }
      },
      mappings: {
        properties: {
          caseNumber: {
            type: 'keyword',
            fields: {
              value: {
                type: 'keyword'
              }
            }
          },
          createdAt: {
            type: 'date',
            fields: {
              value: {
                type: 'date'
              }
            }
          },
          updatedAt: {
            type: 'date',
            fields: {
              value: {
                type: 'date'
              }
            }
          },
          'subjects.name': {
            type: 'text',
            fields: {
              value: {
                type: 'keyword'
              }
            }
          },
          'subjects.establishment': {
            type: 'text',
            fields: {
              value: {
                type: 'keyword'
              }
            }
          }
        }
      }
    }
  });
};

module.exports = async (schema, esClient, options = {}) => {
  const { EnforcementCase } = schema;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  try {
    if (options.reset) {
      await reset(esClient);
    }

    let query = EnforcementCase.query()
      .where(builder => {
        if (options.id) {
          builder.where({ id: options.id });
        }
      })
      .select(columnsToIndex)
      .withGraphFetched('subjects.[establishment, profile, flags.[establishment, profile.establishments, pil.establishment, project.establishment]]');

    const enforcements = await query;

    logger.info(`Indexing ${enforcements.length} enforcements`);

    for (const enforcement of enforcements) {
      await indexEnforcement(esClient, enforcement);
    }

    await esClient.indices.refresh({ index: indexName });

  } catch (error) {
    logger.error('Error indexing enforcements:', error);
    throw error;
  }
};
