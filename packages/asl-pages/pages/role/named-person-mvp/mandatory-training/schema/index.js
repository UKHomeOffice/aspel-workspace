module.exports = (role) => {
  const getNacwoNvsLabel = (roleType) => {
    const labels = {
      nacwo: 'There is an unavoidable delay in completing one or more modules',
      nvs: 'They have not yet completed the NVS module'
    };

    if (!labels[roleType]) {
      throw new Error(`Unknown role type: ${roleType}`);
    }

    return labels[roleType];
  };

  const mandatoryOptions = (roleType) => [
    {
      label: 'Yes',
      value: 'yes',
      behaviour: 'exclusive'
    },
    {
      id: 'divider',
      divider: 'Or select each that applies:',
      className: 'govuk-checkboxes__divider govuk-checkboxes__divider-wide'
    },
    {
      label: 'They have requested an exemption from one or more modules',
      value: 'exemption'
    },
    {
      label: getNacwoNvsLabel(roleType),
      value: 'delay',
      hint:
        roleType === 'nvs'
          ? 'They will complete it within 12 months of starting the role.'
          : null
    }
  ];

  return {
    mandatory: {
      hint: `Select 'Yes' if they have completed all the mandatory training within the last 5 years.`,
      inputType: 'checkboxGroup',
      options: mandatoryOptions(role.type),
      validate: ['required', 'exclusive']
    }
  };
};
