import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import getLocations from './get-locations';

const ESTABLISHMENTS_KEYS = [
  'establishments',
  'polesList',
  'transferToEstablishmentName',
  'other-establishments',
  'poles'
];

const TRIGGERING_KEYS = [
  'objectives',
  'species',
  'protocols',
  ...ESTABLISHMENTS_KEYS
];

const shouldTriggerCleanup = (changed) =>
  intersection(Object.keys(changed), TRIGGERING_KEYS).length > 0;

const shouldTriggerEstablishmentCleanup = (changed) =>
  intersection(Object.keys(changed), ESTABLISHMENTS_KEYS).length > 0;

const filterProtocolSpecies = (protocol, removedSpecies) => {
  if (!Array.isArray(protocol.species) || removedSpecies.length === 0) {
    return protocol; // Return original if no change
  }

  const filtered = protocol.species.filter(species => !removedSpecies.includes(species));

  // Only return new object if species array actually changed
  if (filtered.length === protocol.species.length) {
    return protocol;
  }

  return {
    ...protocol,
    species: filtered
  };
};

const updateProtocolObjectives = (protocol, projectObjectives) => {
  if (!Array.isArray(protocol.objectives)) {
    return protocol;
  }

  const objectiveTitles = (projectObjectives || []).map(o => o.title || o);
  const updatedObjectives = intersection(protocol.objectives, objectiveTitles);

  // Only return new object if objectives actually changed
  if (updatedObjectives.length === protocol.objectives.length) {
    return protocol;
  }

  return {
    ...protocol,
    objectives: updatedObjectives
  };
};

const updateProtocolLocations = (protocol, project, establishment) => {
  if (!Array.isArray(protocol.locations)) {
    return protocol;
  }

  const validLocations = getLocations(project, establishment);
  const updatedLocations = intersection(protocol.locations, validLocations);

  // Only return new object if locations actually changed
  if (updatedLocations.length === protocol.locations.length) {
    return protocol;
  }

  return {
    ...protocol,
    locations: updatedLocations
  };
};

const updateProtocolSpeciesDetails = (protocol) => {
  if (!Array.isArray(protocol.speciesDetails)) {
    return protocol;
  }

  // Check if any speciesDetail needs 'maximum-times-used' update
  const needsUpdate = protocol.speciesDetails.some(detail =>
    !(detail.reuse || []).includes('this-protocol')
  );

  if (!needsUpdate) {
    return protocol;
  }

  const updatedSpeciesDetails = protocol.speciesDetails.map(detail => {
    // Only create new object if this detail needs updating
    if (!detail.reuse.includes('this-protocol')) {
      return {
        ...detail,
        'maximum-times-used': '1',
        lifeStages: detail.lifeStages ? [...detail.lifeStages] : [],
        reuse: detail.reuse ? [...detail.reuse] : []
      };
    }
    return detail; // Return original if no change
  });

  // Check if speciesDetails actually changed
  const hasChanged = updatedSpeciesDetails.some((newDetail, index) => {
    const oldDetail = protocol.speciesDetails[index];
    return newDetail['maximum-times-used'] !== oldDetail['maximum-times-used'];
  });

  if (!hasChanged) {
    return protocol;
  }

  return {
    ...protocol,
    speciesDetails: updatedSpeciesDetails
  };
};

export default function cleanProtocols({
                                         state,
                                         savedState,
                                         changed = {},
                                         establishment,
                                         schemaVersion
                                       }) {
  const project = omitBy({ ...state, ...changed }, isUndefined);

  if (schemaVersion === 0) {
    return project;
  }

  if (!shouldTriggerCleanup(changed)) {
    return project;
  }

  project.protocols = project.protocols || [];

  const changedKeys = Object.keys(changed);
  const hasRelevantChanges = changedKeys.some(key =>
    TRIGGERING_KEYS.includes(key)
  );

  if (!hasRelevantChanges) {
    return project;
  }

  const removedSpecies = changed.species
    ? difference(savedState.species, changed.species)
    : [];

  const objectives = project.objectives || [];
  const shouldUpdateLocations = shouldTriggerEstablishmentCleanup(changed);

  let protocolsChanged = false;
  const updatedProtocols = project.protocols.map(protocol => {
    let transformed = protocol;

    let needsClone = false;

    // Check each transformation to see if it will modify
    if (removedSpecies.length > 0 && Array.isArray(protocol.species)) {
      const wouldChange = protocol.species.some(s => removedSpecies.includes(s));
      if (wouldChange) needsClone = true;
    }

    if (changed.objectives && Array.isArray(protocol.objectives)) {
      const objectiveTitles = objectives.map(o => o.title || o);
      const wouldChange = protocol.objectives.some(obj => !objectiveTitles.includes(obj));
      if (wouldChange) needsClone = true;
    }

    if (shouldUpdateLocations && Array.isArray(protocol.locations)) {
      needsClone = true;
    }

    if (changed.protocols && Array.isArray(protocol.speciesDetails)) {
      const wouldChange = protocol.speciesDetails.some(detail =>
        !detail.reuse.includes('this-protocol')
      );
      if (wouldChange) needsClone = true;
    }

    if (needsClone) {
      transformed = { ...protocol };
      protocolsChanged = true;
    }

    if (removedSpecies.length > 0) {
      transformed = filterProtocolSpecies(transformed, removedSpecies);
    }

    if (changed.objectives) {
      transformed = updateProtocolObjectives(transformed, objectives);
    }

    if (shouldUpdateLocations) {
      transformed = updateProtocolLocations(transformed, project, establishment);
    }

    if (changed.protocols) {
      transformed = updateProtocolSpeciesDetails(transformed);
    }

    return transformed;
  });

  if (protocolsChanged) {
    return {
      ...project,
      protocols: updatedProtocols
    };
  }

  return project;
}
