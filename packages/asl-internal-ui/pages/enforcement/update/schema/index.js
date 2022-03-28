const { get } = require('lodash');
const { render } = require('mustache');
const content = require('../content/form');

const getSchema = subject => {
  const flags = [
    {
      value: `profile-${subject.profile.id}`,
      label: render(content.fields.flags.options.profile.label, { profile: subject.profile }),
      hint: content.fields.flags.options.profile.hint
    }
  ];

  if (subject.profile.pil) {
    flags.push({
      value: `pil-${subject.profile.pil.id}`,
      label: render(content.fields.flags.options.pil.label, { profile: subject.profile }),
      hint: content.fields.flags.options.pil.hint
    });
  }

  if (subject.profile.projects.length) {
    subject.profile.projects.forEach(project => {
      flags.push({
        value: `project-${project.id}`,
        label: render(content.fields.flags.options.project.label, { profile: subject.profile, project }),
        hint: content.fields.flags.options.project.hint
      });
    });
  }

  const remedialActionOptions = [
    'inspector-advice',
    'letter-of-reprimand',
    'reprimand-retraining',
    'compliance-notice',
    'suspension-retraining',
    'licence-revocation',
    'other'
  ].map(value => (
    {
      value,
      label: get(content, `fields.remedialAction.options[${value}].label`, value)
    }
  ));

  return {
    flagStatus: {
      inputType: 'radioGroup',
      label: content.fields.flagStatus.label,
      validate: ['required'],
      automapReveals: true,
      options: [
        {
          value: 'open',
          label: content.fields.flagStatus.options.open.label,
          reveal: {
            flags: {
              inputType: 'checkboxGroup',
              label: content.fields.flags.label,
              hint: content.fields.flags.hint,
              options: flags
            }
          }
        },
        {
          value: 'closed',
          label: content.fields.flagStatus.options.closed.label,
          hint: content.fields.flagStatus.options.closed.hint,
          reveal: {
            flags: {
              inputType: 'checkboxGroup',
              label: content.fields.flags.label,
              hint: content.fields.flags.hint,
              options: flags
            },
            remedialAction: {
              inputType: 'checkboxGroup',
              label: content.fields.remedialAction.label,
              validate: ['required'],
              options: remedialActionOptions
            }
          }
        },
        {
          value: 'no-breach',
          label: content.fields.flagStatus.options['no-breach'].label,
          hint: content.fields.flagStatus.options['no-breach'].hint
        }
      ]
    }
  };
};

module.exports = getSchema;
