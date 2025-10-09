const { pick } = require('lodash');
const deleteIndex = require('../utils/delete-index');

const indexName = 'places';
const columnsToIndex = ['id', 'establishmentId', 'suitability', 'holding', 'restrictions'];
const BATCH_SIZE = 100;

const resetIndex = async (esClient) => {
  console.log(`Rebuilding index ${indexName}`);
  await deleteIndex(esClient, indexName);

  await esClient.indices.create({
    index: indexName,
    body: {
      settings: {
        analysis: {
          analyzer: { default: { tokenizer: 'whitespace', filter: ['lowercase', 'stop'] } },
          normalizer: { licenceNumber: { type: 'custom', filter: ['lowercase'] } }
        }
      },
      mappings: {
        properties: {
          name: { type: 'text', fields: { value: { type: 'keyword' } } },
          area: { type: 'text', fields: { value: { type: 'keyword' } } },
          site: { type: 'text', fields: { value: { type: 'keyword' } } },
          suitability: { type: 'keyword', fields: { value: { type: 'keyword' } } },
          holding: { type: 'keyword', fields: { value: { type: 'keyword' } } },
          'nacwos.name': { type: 'keyword', fields: { value: { type: 'keyword' } } },
          'nvssqps.name': { type: 'keyword', fields: { value: { type: 'keyword' } } }
        }
      }
    }
  });
};

const prepareBulkBody = (places) => {
  return places.flatMap(place => {
    if (place.deleted) {
      return [{ delete: { _index: indexName, _id: place.id } }];
    }

    return [
      { index: { _index: indexName, _id: place.id } },
      {
        ...pick(place, columnsToIndex),
        site: place.site || '',
        area: place.area || '',
        name: place.name || '',
        nacwos: place.nacwos.map(r => ({
          ...pick(r.profile, 'id', 'firstName', 'lastName'),
          name: `${r.profile.firstName} ${r.profile.lastName}`
        })),
        nvssqps: place.nvssqps.map(r => ({
          ...pick(r.profile, 'id', 'firstName', 'lastName'),
          name: `${r.profile.firstName} ${r.profile.lastName}`
        }))
      }
    ];
  });
};

const bulkIndexPlaces = async (esClient, places) => {
  for (let i = 0; i < places.length; i += BATCH_SIZE) {
    const batch = places.slice(i, i + BATCH_SIZE);
    const body = prepareBulkBody(batch);
    await esClient.bulk({ refresh: false, body });
    console.log(`Indexed ${i + batch.length} places`);
  }
};

module.exports = async (schema, esClient, options = {}) => {
  const { Place } = schema;

  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  if (options.reset) await resetIndex(esClient);

  let query = Place.queryWithDeleted()
    .where(builder => {
      if (options.id) builder.where({ 'places.id': options.id });
      if (options.establishmentId) builder.where({ 'places.establishmentId': options.establishmentId });
    })
    .joinRoles();

  let places = await query;

  places = places.map(place => ({
    ...place,
    nacwos: place.roles.filter(r => r.type === 'nacwo'),
    nvssqps: place.roles.filter(r => ['nvs', 'sqp'].includes(r.type))
  }));

  // Bulk index
  await bulkIndexPlaces(esClient, places);

  await esClient.indices.refresh({ index: indexName });
};
