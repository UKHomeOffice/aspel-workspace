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
        if (!subject || !subject.profile || !subject.establishment) {
          return null;
        }

        return {
          profile: pick(subject.profile, ['id', 'firstName', 'lastName', 'email']),
          establishment: subject.establishment.name,
          establishmentKeywords: subject.establishment.keywords || [],
          flags: (subject.flags || []).map(flag => {
            // Include the nested relationships that the formatters need
            const baseFlag = pick(flag, ['id', 'modelType', 'modelId', 'status']);

            // Add the nested objects that formatters expect
            if (flag.establishment) {
              baseFlag.establishment = pick(flag.establishment, ['id', 'name', 'licenceNumber']);
            }

            if (flag.profile) {
              baseFlag.profile = pick(flag.profile, ['id', 'firstName', 'lastName', 'pilLicenceNumber']);
              if (flag.profile.establishments && flag.profile.establishments[0]) {
                baseFlag.profile.establishments = [pick(flag.profile.establishments[0], ['name'])];
              }
            }

            if (flag.pil && flag.pil.establishment) {
              baseFlag.pil = {
                establishmentId: flag.pil.establishment.id,
                profileId: flag.pil.profileId,
                establishment: pick(flag.pil.establishment, ['id', 'name'])
              };
            }

            if (flag.project && flag.project.establishment) {
              baseFlag.project = {
                id: flag.project.id,
                establishmentId: flag.project.establishment.id,
                licenceNumber: flag.project.licenceNumber,
                establishment: pick(flag.project.establishment, ['id', 'name'])
              };
            }

            return baseFlag;
          })
        };
      }).filter(Boolean)
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

module.exports = async (schema, esClient, options = {}) => {
  const { EnforcementCase } = schema;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  try {
    if (options.reset) {
      await reset(esClient);
    }

    // Keep the original graph fetching - it's needed for the nested data
    const enforcements = await EnforcementCase.query()
      .where(builder => {
        if (options.id) {
          builder.where({ id: options.id });
        }
      })
      .select(columnsToIndex)
      .withGraphFetched('subjects.[establishment, profile, flags.[establishment, profile.establishments, pil.establishment, project.establishment]]');

    logger.info(`Indexing ${enforcements.length} enforcements`);

    await Promise.all(
      enforcements.map(enforcement =>
        indexEnforcement(esClient, enforcement).catch(error => {
          logger.error(`Failed to index enforcement ${enforcement.id}:`, error.message);
          return null;
        })
      )
    );

    await esClient.indices.refresh({ index: indexName });

  } catch (error) {
    logger.error('Failed to index enforcements:', error);
    throw error;
  }
};
