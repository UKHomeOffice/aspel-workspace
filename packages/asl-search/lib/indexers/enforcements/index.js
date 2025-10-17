const { pick } = require('lodash');
const deleteIndex = require('../utils/delete-index');
const logger = require('../../logger');

const indexName = 'enforcements';
const columnsToIndex = ['id', 'caseNumber', 'createdAt', 'updatedAt'];

const indexEnforcement = (esClient, enforcement) => {
  return esClient.index({
    index: indexName,
    id: enforcement.id,
    body: {
      ...pick(enforcement, columnsToIndex),
      subjects: (enforcement.subjects || []).map(subject => {
        // Add null checks to prevent errors
        if (!subject || !subject.profile || !subject.establishment) {
          return null;
        }
        return {
          profile: pick(subject.profile, ['id', 'firstName', 'lastName', 'email']),
          establishment: subject.establishment.name,
          establishmentKeywords: subject.establishment.keywords || [],
          flags: (subject.flags || []).map(flag =>
            pick(flag, ['id', 'modelType', 'modelId'])
          )
        };
      }).filter(Boolean) // Remove null subjects
    }
  });
};

const reset = esClient => {
  logger.info(`Rebuilding index ${indexName}`);
  return Promise.resolve()
    .then(() => deleteIndex(esClient, indexName))
    .then(() => {
      return esClient.indices.create({
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
    });
};

module.exports = (schema, esClient, options = {}) => {
  const { EnforcementCase } = schema;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  return Promise.resolve()
    .then(() => {
      if (options.reset) {
        return reset(esClient);
      }
    })
    .then(() => {
      // SIMPLIFIED: Only fetch essential relationships
      return EnforcementCase.query()
        .where(builder => {
          if (options.id) {
            builder.where({ id: options.id });
          }
        })
        .select(columnsToIndex)
        .withGraphFetched('subjects.[establishment, profile, flags]'); // Simplified!
    })
    .then(enforcements => {
      logger.info(`Indexing ${enforcements.length} enforcements`);

      // Use Promise.all for parallel processing (since you only have 7 records)
      return Promise.all(
        enforcements.map(enforcement =>
          indexEnforcement(esClient, enforcement).catch(error => {
            logger.error(`Failed to index enforcement ${enforcement.id}:`, error.message);
            return null; // Continue even if one fails
          })
        )
      );
    })
    .then(() => esClient.indices.refresh({ index: indexName }));
};
