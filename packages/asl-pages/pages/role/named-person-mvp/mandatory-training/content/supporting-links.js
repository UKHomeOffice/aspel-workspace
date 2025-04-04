const mandatoryTrainingSupportingLinks = (roleType) => {
  const nacwoSupportingLinks = [
    {
      href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role',
      label: 'Adding a NACWO role'
    },
    {
      href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act',
      label:
        'Guidance on training and continuous professional development (CPD) under ASPA'
    }
  ];

  if (roleType === 'nacwo') {
    return nacwoSupportingLinks;
  }
};

export default mandatoryTrainingSupportingLinks;
