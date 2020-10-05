module.exports = {
  name: {
    label: 'Establishment name'
  },
  address: {
    label: 'Address'
  },
  licences: {
    label: 'Licensed to carry out',
    options: {
      supplying: 'Supply of relevant protected animals',
      breeding: 'Breeding  of relevant protected animals',
      procedure: 'Regulated scientific procedures on regulated animals'
    }
  },
  isTrainingEstablishment: {
    label: 'Does the establishment run training courses that require Category E personal licences?'
  },
  authorisationTypes: {
    label: 'Authorisations',
    options: {
      killing: 'Methods of killing not specified in Schedule 1',
      rehomes: 'Setting free and rehoming of protected animals bred, kept or supplied but not used in regulated procedures'
    }
  },
  'authorisation-killing-method': {
    label: 'Specify a killing method.'
  },
  'authorisation-killing-description': {
    label: 'Specify the type or describe the animals to which the killing method will be applied.'
  },
  'authorisation-rehomes-method': {
    label: 'Provide details of the circumstances under which this may occur. ([See section 17A of the Animals (Scientific Procedures) Act 1986 - subsections 3 and 4.](https://www.gov.uk/government/publications/consolidated-version-of-aspa-1986))'
  },
  'authorisation-rehomes-description': {
    label: 'Provide details of the animals to be set free or rehomed.'
  },
  comments: {
    label: 'Why are you making this amendment?',
    hint: 'Comments can be seen by establishment users, as well as inspectors and Home Office team members.'
  }
};
