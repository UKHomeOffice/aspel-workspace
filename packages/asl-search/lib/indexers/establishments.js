const { pick } = require('lodash');

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

module.exports = (schema, esClient) => {
  const { Establishment } = schema;

  return Promise.resolve()
    .then(() => esClient.indices.delete({ index: indexName }).catch(() => {}))
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
    })
    .then(() => {
      return Establishment.query()
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
