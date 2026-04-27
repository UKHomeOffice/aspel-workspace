import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, ErrorSummary } from '@ukhomeoffice/asl-components';
import content from '../content/skills-and-experience';

const Page = () => {

  const { profile, roleType, errors = {} } = useSelector(state => state.static, shallowEqual);
  const roleKey = (roleType || '').toLowerCase();
  const contentKey = content.fields[roleKey] ? roleKey : 'default';
  const titleKey = content.title[roleKey] ? roleKey : 'default';
  const renderers = {};

  for (const key of Object.keys(content.fields[contentKey] || {})) {
    const fieldContent = content.fields[contentKey]?.[key];
    const hasRoleSpecificErrors = !!content.errors?.[key]?.[roleKey];
    renderers[key] = {
      propMappers: {
        label: () => <Snippet>{`fields.${contentKey}.${key}.label`}</Snippet>,
        ...(fieldContent?.hint && {
          hint: () => <Snippet>{`fields.${contentKey}.${key}.hint`}</Snippet>
        }),
        ...(hasRoleSpecificErrors && {
          error: () => {
            const errorType = errors[key] || 'required';
            return (
              <Snippet fallback={`errors.${key}.${errorType}`}>
                {`errors.${key}.${roleKey}.${errorType}`}
              </Snippet>
            );
          }
        })
      }
    };
  }

  return (
    <div>
      <span className="govuk-caption-l">{profile.firstName} {profile.lastName}</span>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <ErrorSummary renderers={renderers} />
          <Form renderers={renderers} cancelLink="profile.read">
            <Header title={<Snippet>{`title.${titleKey}`}</Snippet>} />

            <div className="govuk-body">{content.fields[contentKey]?.desc && <strong><Snippet>{`fields.${contentKey}.desc`}</Snippet></strong>}</div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
