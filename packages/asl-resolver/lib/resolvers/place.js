const { pick } = require('lodash');

module.exports = ({ models }) => ({ action, data, id }) => {
  if (!id && (action === 'update' || action === 'delete')) {
    return Promise.reject(new Error(`id is required on ${action}`));
  }

  const { Place } = models;

  if (data) {
    if (data.nacwo) {
      data.nacwoId = data.nacwo;
    }

    data = pick(data, Object.keys(Place.jsonSchema.properties));

    if (typeof data.suitability === 'string') {
      data.suitability = JSON.parse(data.suitability);
    }
    if (typeof data.holding === 'string') {
      data.holding = JSON.parse(data.holding);
    }
  }

  if (action === 'create') {
    return Place.query()
      .insert(data)
      .returning('*');
  }

  if (action === 'update') {
    return Place.query()
      .patchAndFetchById(id, data);
  }

  if (action === 'delete') {
    return Place.query()
      .findById(id)
      .delete()
      .returning('*');
  }

  return Promise.reject(new Error(`Unknown action: ${action}`));

};
