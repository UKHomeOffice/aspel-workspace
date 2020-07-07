const { pick, get } = require('lodash');

const indexName = 'establishments';
const columnsToIndex = ['id', 'name', 'licenceNumber', 'status'];

const indexEstablishment = (esClient, establishment) => {
  return esClient.index({
    index: indexName,
    id: establishment.id,
    body: {
      ...pick(establishment, columnsToIndex),
      asru: establishment.asru.map(p => pick(p, 'id', 'firstName', 'lastName', 'asruInspector', 'asruLicensing'))
    }
  });
};

const reset = esClient => {
  console.log(`Rebuilding index ${indexName}`);
  return Promise.resolve()
    .then(() => esClient.indices.delete({ index: indexName }))
    .catch(e => {
      if (get(e, 'body.error.type') === 'index_not_found_exception') {
        return;
      }
      throw e;
    })
    .then(() => {
      return esClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text',
                fields: {
                  value: {
                    type: 'keyword'
                  }
                }
              },
              licenceNumber: {
                type: 'keyword'
              },
              status: {
                type: 'keyword',
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
}

module.exports = (schema, esClient, options = {}) => {
  const { Establishment } = schema;

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
      return Establishment.query()
        .where(builder => {
          if (options.id) {
            builder.where({ id: options.id });
          }
        })
        .select(columnsToIndex)
        .withGraphFetched('[asru]');
    })
    .then(establishments => {
      console.log(`Indexing ${establishments.length} establishments`);
      return establishments.reduce((p, establishment) => {
        return p.then(() => indexEstablishment(esClient, establishment));
      }, Promise.resolve());
    })
    .then(() => esClient.indices.refresh({ index: indexName }));
};
