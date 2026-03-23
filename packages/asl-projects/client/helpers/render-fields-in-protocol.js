import NTSFateOfAnimalFields from './nts-field';

export const renderFieldsInProtocol = (fateOfAnimals, values) => {
  const predefinedFields = NTSFateOfAnimalFields();

  console.log('renderFieldsInProtocol: ', values);

  if (!fateOfAnimals) {
    return [predefinedFields['continued-use']];
  }

  // Create an ordered list of fields based on fateOfAnimals
  const orderedFields = [
    fateOfAnimals.includes('killed') ? predefinedFields['killed'] : null,
    predefinedFields['continued-use'], // This field is always present
    fateOfAnimals.includes('used-in-other-projects') ? predefinedFields['continued-use-2'] : null,
    fateOfAnimals.includes('set-free') ? predefinedFields['set-free'] : null,
    fateOfAnimals.includes('rehomed') ? predefinedFields['rehomed'] : null,
    fateOfAnimals.includes('kept-alive') ? predefinedFields['kept-alive'] : null
  ];

  // Filter out null values
  return orderedFields.filter(field => field !== null);
  // todo: before returning, caclulate standardProtocolType, isStandardProtocol with list of constants and app that filter aswell.
  // i.e [!null] + [whiteList_of_fields_based_on_type]
};
