const mandatoryTrainingSupportingLinks = (roleType) => {
  const guidanceOnTrainingSupportingLink = {
    href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act',
    label:
      'Guidance on training and continuous professional development (CPD) under ASPA'
  };

  const nacwoSupportingLinks = [
    {
      href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role',
      label: 'Adding a NACWO role'
    },
    guidanceOnTrainingSupportingLink
  ];

  const nvsSupportingLinks = [
    {
      href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role',
      label: 'Adding a NVS role'
    },
    guidanceOnTrainingSupportingLink
  ];

  if (roleType === 'nacwo') {
    return nacwoSupportingLinks;
  }

  if (roleType === 'nvs') {
    return nvsSupportingLinks;
  }
};

export default mandatoryTrainingSupportingLinks;
