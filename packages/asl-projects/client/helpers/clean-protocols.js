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

  // Handle species changes immutably
  if (changed.species) {
    const removedProjectSpecies = difference(savedState.species, changed.species);

    project.protocols = project.protocols.map(protocol => {
      if (!Array.isArray(protocol.species)) {
        return protocol;
      }
      const newSpecies = protocol.species.filter(species => !removedProjectSpecies.includes(species));

      // Only create new protocol object if species changed
      if (newSpecies.length === protocol.species.length) {
        return protocol;
      }

      return {
        ...protocol,
        species: newSpecies
      };
    });
  }

  const locations = getLocations(project, establishment);
  const objectives = (project.objectives || []).map(o => o.title);

  // Handle objectives and locations changes immutably
  project.protocols = project.protocols.map(protocol => {
    let protocolUpdated = { ...protocol };
    let hasChanges = false;

    if (changed.objectives) {
      const newObjectives = intersection(protocol.objectives, objectives);
      if (newObjectives.length !== (protocol.objectives || []).length) {
        protocolUpdated.objectives = newObjectives;
        hasChanges = true;
      }
    }

    if (changesShouldTriggerEstablishmentCleanup(changed)) {
      const newLocations = intersection(protocol.locations, locations);
      if (newLocations.length !== (protocol.locations || []).length) {
        protocolUpdated.locations = newLocations;
        hasChanges = true;
      }
    }

    return hasChanges ? protocolUpdated : protocol;
  });

  if (changed.protocols) {
    project.protocols = project.protocols.map(protocol => {
      // Check if we need to update speciesDetails
      const needsUpdate = (protocol.speciesDetails ?? []).some(sd =>
        !(sd.reuse || []).includes('this-protocol')
      );

      if (!needsUpdate) {
        return protocol;
      }

      // Create new protocol object with updated speciesDetails
      return {
        ...protocol,
        speciesDetails: (protocol.speciesDetails ?? []).map(speciesDetail => {
          if (!(speciesDetail.reuse || []).includes('this-protocol')) {
            // Create new object with updated maximum-times-used
            return {
              ...speciesDetail,
              'maximum-times-used': '1'
            };
          }
          return speciesDetail;
        })
      };
    });
  }

  return project;
}
