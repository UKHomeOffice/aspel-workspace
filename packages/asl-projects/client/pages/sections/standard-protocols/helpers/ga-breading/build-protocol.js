import { v4 as uuidv4 } from 'uuid';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import castArray from 'lodash/castArray';
import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';

export const BuildProtocol = (protocolTemplate, project) => {

  console.log('BuildProtocol: ', project['fate-of-animals']);
  // Safe defaults with immutability in mind
  const protocolId = uuidv4();
  const data = protocolTemplate?.data ? { ...protocolTemplate.data } : {};

  // Get all species (safe, immutable)
  const allSpecies = flatten(values(SPECIES ?? {})) ?? [];

  // Project species - create new array, don't mutate original
  const projectSpecies = castArray(project?.species ?? []).slice();

  // Template species details - create new array of copied objects
  const templateSpeciesDetails = Array.isArray(data.speciesDetails)
    ? data.speciesDetails.map(sd => ({ ...sd }))
    : [];

  // Create species details for each project species
  const speciesDetails = projectSpecies
    .map(speciesValue => {
      // Find species match (if possible)
      const speciesMatch = allSpecies.find(s => s?.value === speciesValue);

      // Find matching template - create fresh object
      const matchingTemplate = templateSpeciesDetails.find(sd => sd?.species === speciesValue)
        || templateSpeciesDetails[0]
        || {};

      // Return a brand new object every time
      return {
        id: uuidv4(),
        species: speciesValue,
        name: speciesMatch?.label ?? speciesValue,

        // Global settings
        isStandardProtocol: Boolean(data.isStandardProtocol),
        standardProtocolType: data.standardProtocolType ?? '',

        // Species-specific data - always new arrays/strings
        'life-stages': Array.isArray(matchingTemplate.lifeStages)
          ? [...matchingTemplate.lifeStages]  // New array
          : [],
        'continued-use': Boolean(matchingTemplate.continuedUse),
        'continued-use-sourced': matchingTemplate.continuedUseSourced ?? '',
        'reuse': Array.isArray(matchingTemplate.reuse)
          ? [...matchingTemplate.reuse]  // New array
          : [],
        'reuse-details': matchingTemplate.reuseDetails ?? ''
      };
    })
    // Remove duplicates by species - creates new array
    .filter((sd, index, self) =>
      index === self.findIndex(s => s.species === sd.species)
    );

  // Create steps - each step is a new object with new arrays
  const steps = (Array.isArray(data.steps) ? [...data.steps] : [])
    .map(step => {
      const stepObj = step || {};
      return {
        id: uuidv4(),
        title: stepObj.title ?? '',
        reference: stepObj.reference ?? '',
        optional: Boolean(stepObj.optional),
        adverse: Boolean(stepObj.adverse),
        'adverse-effects': stepObj['adverse-effects'] ?? '',
        'prevent-adverse-effects': stepObj['prevent-adverse-effects'] ?? '',
        completed: Boolean(stepObj.completed),
        isStandardProtocol: Boolean(stepObj.isStandardProtocol),
        standardProtocolType: stepObj.standardProtocolType ?? '',
        endpoints: stepObj.endpoints ?? '',
        readonly: Boolean(stepObj.readonly),
        reusable: Boolean(stepObj.reusable)
      };
    });

  // Build and return the protocol - ALL NEW OBJECTS, no references to input
  return {
    id: protocolId,
    title: protocolTemplate?.label ?? 'Untitled Protocol',
    complete: false,

    // Metadata - all new primitives or copies
    isStandardProtocol: Boolean(data.isStandardProtocol),
    standardProtocolType: data.standardProtocolType ?? '',
    protocolName: data.protocolName ?? '',

    description: data.description ?? '',
    severity: data.severity ?? '',
    'severity-proportion': data.severityProportion ?? '',
    'severity-details': data.severityDetails ?? '',

    // Collections - always new arrays/objects
    locations: Array.isArray(data.locations) ? [...data.locations] : [],
    objectives: Array.isArray(data.objectives) ? [...data.objectives] : [],
    animals: data.animals ? { ...data.animals } : {},

    // Species data - new arrays with new objects
    species: [...projectSpecies],
    speciesDetails: [...speciesDetails],
    steps: [...steps],
    gaas: Boolean(data.gaas),
    'gaas-types': data.gaasTypes ?? '',
    'gaas-harmful': Boolean(data.gaasHarmful),
    fate: Array.isArray(data.fate) ? [...data.fate] : [],
    'non-schedule-1': Boolean(data.nonSchedule1),
    'experience-summary': data.experienceSummary ?? '',
    'experience-endpoints': data.experienceEndpoints ?? '',
    'outputs': data.outputs ?? '',
    'quantitative-data': data['quantitative-data'] ?? '',
  };
};
