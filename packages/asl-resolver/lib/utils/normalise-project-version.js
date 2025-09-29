const uuid = require('uuid/v4');
const { omit, toSafeInteger } = require('lodash');

function normaliseProtocolSpecies(protocol) {
  if (!protocol.speciesDetails) {
    return;
  }
  protocol.speciesDetails.forEach(species => {
    species.id = species.id || uuid();
  });
}

/**
 * ASL-4511 changed the format of `protocol.reuse` from a boolean to an array
 * due to the input changing to a multiselect with two reuse options or an
 * exclusive "no reuse" option. Where there are existing `.ppl` templates we
 * need to transform the old representation into the new.
 *
 * @param {object} protocol
 */
function normaliseProtocolReuse(protocol) {
  if (!protocol.speciesDetails) {
    return;
  }

  protocol.speciesDetails.forEach(species => {
    if (Array.isArray(species.reuse)) {
      return;
    }

    species.reuse = [
      ...(species.reuse ? ['other-protocol'] : []),
      ...(toSafeInteger(species['maximum-times-used']) > 1 ? ['this-protocol'] : [])
    ];

    if (species.reuse.length === 0) {
      species.reuse = ['no'];
    }
  });

}

module.exports = (version = {}) => {
  if (!version.data) {
    return version;
  }

  // strip additional availability and transfer info
  version.data.establishments = (version.data.establishments || []).map(est => omit(est, 'establishment-id', 'name'));
  version.data.transferToEstablishment = null;
  version.data.transferToEstablishmentName = null;

  if (!version.data.protocols) {
    return version;
  }
  version.data.protocols.forEach(protocol => {
    normaliseProtocolSpecies(protocol);
    normaliseProtocolReuse(protocol);
  });

  return version;
};
