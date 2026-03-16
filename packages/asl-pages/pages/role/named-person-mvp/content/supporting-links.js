const mandatoryTrainingSupportingLinks = (roleType) => {
  const guidanceOnTrainingSupportingLink = (roleType) => {
    let href;
    if (roleType === 'nacwo') {
      href = 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-animal-care-and-welfare-officers-nacwos';
    } else if (roleType === 'nvs') {
      href = 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-veterinary-surgeons-nvs';
    } else if (roleType === 'sqp') {
      href = 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#other-suitably-qualified-person';
    }

    return {
      href: href,
      label: 'Guidance on training and continuous professional development (CPD) under ASPA'
    };
  };

  const supportingLinksMap = {
    nacwo: [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role',
        label: 'NACWO role guide'
      },
      guidanceOnTrainingSupportingLink(roleType)
    ],
    nvs: [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role',
        label: 'NVS role guide'
      },
      guidanceOnTrainingSupportingLink(roleType)
    ],
    sqp: [
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role',
        label: 'Adding a SQP role'
      },
      guidanceOnTrainingSupportingLink(roleType)
    ]
  };

  return supportingLinksMap[roleType] || [];
};

export default mandatoryTrainingSupportingLinks;
