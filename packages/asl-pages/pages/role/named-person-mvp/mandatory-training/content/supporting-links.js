const mandatoryTrainingSupportingLinks = (roleType) => {
  const guidanceOnTrainingSupportingLink = {
    href: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act',
    label:
      'Guidance on training and continuous professional development (CPD) under ASPA'
  };

  const supportingLinksMap = {
    nacwo: [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role',
        label: 'Adding a NACWO role'
      },
      guidanceOnTrainingSupportingLink
    ],
    nvs: [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role',
        label: 'Adding a NVS role'
      },
      guidanceOnTrainingSupportingLink
    ]
  };

  return supportingLinksMap[roleType] || [];
};

export default mandatoryTrainingSupportingLinks;
