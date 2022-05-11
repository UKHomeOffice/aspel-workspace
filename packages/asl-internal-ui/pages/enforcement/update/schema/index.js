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

  const flaggableProjects = (subject.profile.projects || []).filter(p => p.status !== 'inactive');

  if (flaggableProjects.length) {
    flaggableProjects.forEach(project => {
      flags.push({
        value: `project-${project.id}`,
        label: render(content.fields.flags.options.project.label, { profile: subject.profile, project }),
        hint: content.fields.flags.options.project.hint
      });
    });
  }

  const pelhEstablishments = subject.profile.roles.filter(r => r.type === 'pelh').map(r => r.establishment);

  if (pelhEstablishments.length) {
    pelhEstablishments.forEach(establishment => {
      flags.push({
        value: `establishment-${establishment.id}`,
        label: render(content.fields.flags.options.establishment.label, { profile: subject.profile, establishment }),
        hint: content.fields.flags.options.establishment.hint,
        reveal: {
          modelOptions: {
            inputType: 'checkboxGroup',
            options: [
              {
                value: `places-${establishment.id}`,
                label: content.fields.modelOptions.options.places.label
              },
              {
                value: `roles-${establishment.id}`,
                label: content.fields.modelOptions.options.roles.label
              },
              {
                value: `details-${establishment.id}`,
                label: content.fields.modelOptions.options.details.label,
                hint: content.fields.modelOptions.options.details.hint
              }
            ]
          }
        }
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
              options: flags,
              automapReveals: true
            }
          }
        },
        {
          value: 'closed',
          reveal: {
            flags: {
              inputType: 'checkboxGroup',
              options: flags,
              automapReveals: true
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
