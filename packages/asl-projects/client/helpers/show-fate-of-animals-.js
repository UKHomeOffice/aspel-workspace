export const showFateOfAnimals = (values, fieldName) => {

  console.log('showFateOfAnimals -> values:', values, 'fieldName:', fieldName, 'standard: ', values.isStandardProtocol, 'type:', values.standardProtocolType === 'standard', 'name:', values.protocolName === 'rodent-breeding-mild');
  // Case 1 → standard protocols SP
  if (values.isStandardProtocol && values.standardProtocolType === 'standard') {
    if (values.protocolName === 'rodent-breeding-mild') {
      console.log('isRodentBreedingMild', values.protocolName);
      return rodentBreedingMild(values.project['fate-of-animals'], fieldName);
    }
    // fallback for other standard protocols
    return true;
  }

  // Case 2 → editable protocols EEP
  if (!values.isStandardProtocol && values.standardProtocolType === 'editable') {
    return true;
  }

  // Case 3 → default
  return true;
};

// Main driver for rodent-breeding-mild protocol
const rodentBreedingMild = (fateOfAnimals, fieldName) => {
  console.log('rodentBreedingMild -> fateOfAnimals:', fateOfAnimals, 'fieldName:', fieldName);
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

  // Log the visibility of each field
  const visibilityMap = {};
  allFields.forEach(f => {
    visibilityMap[f] = allowedFates.includes(f);
  });

  console.log('visibility:', visibilityMap);
  const result = allowedFates.includes(fieldName);
  console.log('result-fate: ', result);
  // Return visibility for the requested field
  return result;
};
