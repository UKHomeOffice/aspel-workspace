const resolver = require('./base-resolver');
const { pick } = require('lodash');
const { generateLicenceNumber } = require('../utils');

module.exports = ({ models }) => ({ action, data, id }, transaction) => {
  const { PIL } = models;

  if (action === 'grant') {
    if (Array.isArray(data.species)) {
      data.species = data.species.filter(Boolean);

      if (!data.species.length) {
        data.species = null;
      }
    }

    return Promise.resolve()
      .then(() => generateLicenceNumber(PIL, transaction, 'pil'))
      .then(licenceNumber => {
        return PIL.query(transaction).findById(id)
          .then(pil => pil.$query(transaction).patchAndFetch({
            status: 'active',
            issueDate: new Date().toISOString(),
            licenceNumber: pil.licenceNumber || licenceNumber,
            species: data.species,
            procedures: data.procedures,
            notesCatD: data.notesCatD,
            notesCatF: data.notesCatF
          }));
      });
  }

  if (action === 'update-conditions') {
    data = pick(data, 'conditions');
    action = 'update';
  }

  if (action === 'revoke') {
    return PIL.query(transaction).patchAndFetchById(id, {
      status: 'revoked',
      revocationDate: new Date().toISOString()
    });
  }

  return resolver({ Model: models.PIL, action, data, id }, transaction);
};
