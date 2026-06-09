export const showFateOfAnimals = (values = {}, fieldName) => {
  const protocolValues = values?.values && typeof values.values === 'object'
    ? values.values
    : values;

  const project = protocolValues.project || values.project || {};
  const fateOfAnimals = project['fate-of-animals'] || [];

  // Case 1 → standard protocols SP
  if (protocolValues.isStandardProtocol && protocolValues.standardProtocolType === 'standard') {
    if (protocolValues.protocolName === 'rodent-breeding-mild') {
      return rodentBreedingMild(fateOfAnimals, fieldName);
    }
    // fallback for other standard protocols
    return true;
  }

  // Case 2 → editable protocols EEP
  if (!protocolValues.isStandardProtocol && protocolValues.standardProtocolType === 'editable') {
    return true;
  }

  // Case 3 → default
  return true;
};

// Main driver for rodent-breeding-mild protocol
const rodentBreedingMild = (fateOfAnimals = [], fieldName) => {
  // Mapping of all fields and their visibility
  const allFields = [
    'killed',
    'continued-use',
    'continued-use-2',
    'set-free',
    'rehomed',
    'kept-alive'
  ];

  let allowedFates = [];

  // 3a. If any of the main fates selected
  const hasAllFates = fateOfAnimals.some(f =>
    allFields.includes(f)
  );

  if (hasAllFates) {
    allowedFates = [
      'killed',
      'continued-use',
      'continued-use-2',
      'kept-alive'
    ];
  }

  // 3b. If only limited fates selected: set-free, rehomed, kept-alive
  const limitedFates =
    fateOfAnimals.length > 0 &&
    fateOfAnimals.every(f => ['set-free', 'rehomed', 'kept-alive'].includes(f));

  if (limitedFates) {
    allowedFates = [
      'continued-use',
      'kept-alive'
    ];
  }

  // fallback → show all
  if (allowedFates.length === 0) {
    allowedFates = allFields;
  }

  return allowedFates.includes(fieldName);
};
