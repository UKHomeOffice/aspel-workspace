const { pick } = require('lodash');
const deleteIndex = require('../utils/delete-index');

const indexName = 'enforcements';
const columnsToIndex = ['id', 'caseNumber', 'createdAt', 'updatedAt'];
const BATCH_SIZE = 100;

const resetIndex = async (esClient) => {
  console.log(`Rebuilding index ${indexName}`);
  await deleteIndex(esClient, indexName);

  await esClient.indices.create({
    index: indexName,
    body: {
      settings: {
        analysis: {
          analyzer: { default: { tokenizer: 'whitespace', filter: ['lowercase', 'stop'] } }
        }
      },
      mappings: {
        properties: {
          caseNumber: { type: 'keyword', fields: { value: { type: 'keyword' } } },
          createdAt: { type: 'date', fields: { value: { type: 'date' } } },
          updatedAt: { type: 'date', fields: { value: { type: 'date' } } },
          'subjects.name': { type: 'text', fields: { value: { type: 'keyword' } } },
          'subjects.establishment': { type: 'text', fields: { value: { type: 'keyword' } } }
        }
      }
    }
  });
};

const prepareBulkBody = (enforcements) => {
  return enforcements.flatMap(enforcement => [
    { index: { _index: indexName, _id: enforcement.id } },
    {
      ...pick(enforcement, columnsToIndex),
      subjects: enforcement.subjects.map(subject => ({
        profile: subject.profile,
        establishment: subject.establishment.name,
        establishmentKeywords: subject.establishment.keywords,
        flags: subject.flags
      }))
    }
  ]);
};

const bulkIndexEnforcements = async (esClient, enforcements) => {
  for (let i = 0; i < enforcements.length; i += BATCH_SIZE) {
    const batch = enforcements.slice(i, i + BATCH_SIZE);
    const body = prepareBulkBody(batch);
    await esClient.bulk({ refresh: false, body });
    console.log(`Indexed ${i + batch.length} enforcements`);
  }
};

module.exports = async (schema, esClient, options = {}) => {
  const { EnforcementCase } = schema;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  if (options.reset) await resetIndex(esClient);

  // Fetch enforcement cases
  let query = EnforcementCase.query()
    .where(builder => {
      if (options.id) builder.where({ id: options.id });
    })
    .select(columnsToIndex)
    .withGraphFetched('subjects.[establishment, profile, flags.[establishment, profile.establishments, pil.establishment, project.establishment]]');

  const enforcements = await query;

  await bulkIndexEnforcements(esClient, enforcements);

  await esClient.indices.refresh({ index: indexName });
};
