import { v4 as uuidv4 } from 'uuid';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import castArray from 'lodash/castArray';
import uniqBy from 'lodash/uniqBy';
import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';

export const BuildProtocol = (protocolTemplate, project) => {
  const protocolId = uuidv4();
  const data = protocolTemplate.data || {};

  const allSpecies = flatten(values(SPECIES));

  const templateSpeciesDetail = data.speciesDetails?.[0] ?? {};

  const createSpeciesDetail = (speciesValue) => {
    const match = allSpecies.find(s => s.value === speciesValue);
    if (!match) return null;

    return {
      id: uuidv4(),
      value: speciesValue,
      name: match.label,
      isStandardProtocol: !!data.isStandardProtocol,
      standardProtocolType: data.standardProtocolType || '',
      'life-stages': templateSpeciesDetail['life-stages'] ?? [],
      'continued-use': templateSpeciesDetail['continued-use'] ?? false,
      reuse: templateSpeciesDetail.reuse ?? [],
      'reuse-details': templateSpeciesDetail['reuse-details'] ?? '',
      'continued-use-sourced': templateSpeciesDetail['continued-use-sourced'] ?? ''
    };
  };

  // checkbox source of truth
  const species = castArray(project.species || []);

  // wraps animals: {Object}
  const speciesDetails = uniqBy(
    species.map(createSpeciesDetail).filter(Boolean),
    sd => sd.value
  );

  const steps = (data.steps || []).map(step => ({
    id: uuidv4(),
    title: step.title || '',
    reference: step.reference || '',
    optional: step.optional ?? false,
    adverse: step.adverse ?? false,
    'adverse-effects': step['adverse-effects'] || '',
    'prevent-adverse-effects': step['prevent-adverse-effects'] || '',
    endpoints: step.endpoints || '',
    reusable: step.reusable ?? false
  }));

  return {
    id: protocolId,
    title: protocolTemplate.label || 'Untitled Protocol',
    complete: false,

    // === Metadata ===
    isStandardProtocol: !!data.isStandardProtocol,
    standardProtocolType: data.standardProtocolType || '',
    description: data.description || '',
    severity: data.severity || '',
    'severity-proportion': data['severity-proportion'] || '',
    'severity-details': data['severity-details'] || '',
    locations: data.locations ? [...data.locations] : [],
    objectives: data.objectives ? [...data.objectives] : [],
    animals: data.animals ? { ...data.animals } : {},

    species,
    speciesDetails,
    steps
  };
};
