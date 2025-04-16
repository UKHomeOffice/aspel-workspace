module.exports = (role) => {
  const nacwoNvsLabel = (roleType) => {
    if (roleType === 'nacwo') {
      return 'There is an unavoidable delay in completing one or more modules';
    } else if (roleType === 'nvs') {
      return 'They have not yet completed the NVS module';
    } else {
      throw new Error(`Unknown role type: ${roleType}`);
    }
  };

  return {
    mandatory: {
      hint: `Select 'Yes' if they have completed all the mandatory training within the last 5 years`,
      inputType: 'checkboxGroup',
      options: [
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
          label: nacwoNvsLabel(role.type),
          value: 'delay'
        }
      ],
      validate: ['required', 'exclusive']
    }
  };
};
