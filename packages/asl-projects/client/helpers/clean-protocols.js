import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import getLocations from './get-locations';

const establishmentsKeys = [
  'establishments',
  'polesList',
  'transferToEstablishmentName',
  'other-establishments',
  'poles'
];

const triggeringKeys = [
  'objectives',
  'species',
  'protocols',
  ...establishmentsKeys
];

function changesShouldTriggerCleanup(changed) {
  return intersection(Object.keys(changed), triggeringKeys).length > 0;
}

function changesShouldTriggerEstablishmentCleanup(changed) {
  return intersection(Object.keys(changed), establishmentsKeys).length > 0;
}

export default function cleanProtocols({ state, savedState, changed = {}, establishment, schemaVersion }) {
  const project = omitBy({ ...state, ...changed }, isUndefined);

  if (schemaVersion === 0) {
    return project;
  }

  if (!changesShouldTriggerCleanup(changed)) {
    return project;
  }

  project.protocols = project.protocols || [];

  if (changed.species) {
    const removedProjectSpecies = difference(savedState.species, changed.species);

    project.protocols.forEach(protocol => {
      if (!Array.isArray(protocol.species)) {
        return;
      }
      protocol.species = protocol.species.filter(species => !removedProjectSpecies.includes(species));
    });
  }

  const locations = getLocations(project, establishment);
  const objectives = (project.objectives || []).map(o => o.title);

  project.protocols.forEach(protocol => {
    if (changed.objectives) {
      protocol.objectives = intersection(protocol.objectives, objectives);
    }
    if (changesShouldTriggerEstablishmentCleanup(changed)) {
      protocol.locations = intersection(protocol.locations, locations);
    }
  });

  if (changed.protocols) {
    project.protocols.forEach(protocol => {
      (protocol.speciesDetails ?? []).forEach(speciesDetail => {
        if (!(speciesDetail.reuse || []).includes('this-protocol')) {
          speciesDetail['maximum-times-used'] = '1';
        }
      });
    });
  }

  return project;
}
