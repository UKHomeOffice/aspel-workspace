const { pick } = require('lodash');
const deleteIndex = require('../utils/delete-index');

const indexName = 'establishments';
const columnsToIndex = ['id', 'name', 'licenceNumber', 'status', 'keywords', 'suspendedDate', 'corporateStatus'];
const BATCH_SIZE = 100;

const resetIndex = async (esClient) => {
  console.log(`Rebuilding index ${indexName}`);
  await deleteIndex(esClient, indexName);

  await esClient.indices.create({
    index: indexName,
    body: {
      settings: {
        analysis: {
          analyzer: {
            default: { tokenizer: 'whitespace', filter: ['lowercase', 'stop'] }
          },
          normalizer: { licenceNumber: { type: 'custom', filter: ['lowercase'] } }
        }
      },
      mappings: {
        properties: {
          name: { type: 'text', fields: { value: { type: 'keyword' } } },
          licenceNumber: { type: 'keyword', normalizer: 'licenceNumber' },
          status: { type: 'keyword', fields: { value: { type: 'keyword' } } },
          corporateStatus: { type: 'keyword', fields: { value: { type: 'keyword' } } },
          suspendedDate: { type: 'date', fields: { value: { type: 'date' } } }
        }
      }
    }
  });
};

const bulkIndexEstablishments = async (esClient, establishments) => {
  const body = establishments.flatMap(est => [
    { index: { _index: indexName, _id: est.id } },
    { ...pick(est, columnsToIndex), licenceNumber: est.licenceNumber ? est.licenceNumber.toUpperCase() : null }
  ]);

  await esClient.bulk({ refresh: false, body });
};

module.exports = async (schema, esClient, options = {}) => {
  const { Establishment } = schema;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  if (options.reset) await resetIndex(esClient);

  let query = Establishment.query().select(columnsToIndex).withGraphFetched('[asru]');
  if (options.id) {
    const est = await query.findById(options.id);
    if (!est) return;
    await bulkIndexEstablishments(esClient, [est]);
    await esClient.indices.refresh({ index: indexName });
    return;
  }

  let offset = 0;
  while (true) {
    const batch = await query.offset(offset).limit(BATCH_SIZE);
    if (!batch.length) break;

    await bulkIndexEstablishments(esClient, batch);
    console.log(`Indexed ${offset + batch.length} establishments`);
    offset += batch.length;
  }

  await esClient.indices.refresh({ index: indexName });
};
