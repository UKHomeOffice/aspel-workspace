const { render } = require('mustache');
const content = require('../content');

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

  return {
    flagStatus: {
      inputType: 'radioGroup',
      validate: ['required'],
      automapReveals: true,
      options: [
        {
          value: 'open',
          reveal: {
            flags: {
              inputType: 'checkboxGroup',
              options: flags
            }
          }
        },
        {
          value: 'closed',
          reveal: {
            flags: {
              inputType: 'checkboxGroup',
              options: flags
            },
            remedialAction: {
              inputType: 'checkboxGroup',
              validate: ['required'],
              options: [
                'inspector-advice',
                'letter-of-reprimand',
                'reprimand-retraining',
                'compliance-notice',
                'suspension-retraining',
                'licence-revocation',
                'other'
              ]
            }
          }
        },
        {
          value: 'no-breach'
        }
      ]
    }
  };
};

module.exports = getSchema;
