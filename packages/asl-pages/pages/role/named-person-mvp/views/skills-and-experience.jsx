import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form } from '@ukhomeoffice/asl-components';
import content from '../content/skills-and-experience';

const Page = () => {

  const { profile, roleType } = useSelector(state => state.static, shallowEqual);
  const roleKey = (roleType || '').toLowerCase();
  const contentKey = content.fields[roleKey] ? roleKey : 'default';
  const titleKey = content.title[roleKey] ? roleKey : 'default';
  const renderers = {};

  for (const key of Object.keys(content.fields[contentKey] || {})) {
    const errorKey = content.errors.fields[roleKey]?.[key] ? roleKey : 'default';
    renderers[key] = {
      propMappers: {
        label: () => <Snippet>{`fields.${contentKey}.${key}.label`}</Snippet>,
        hint: () => <Snippet>{`fields.${contentKey}.${key}.hint`}</Snippet>,
        error: () => <Snippet>{`errors.fields.${errorKey}.${key}.required`}</Snippet>
      }
    };
  }

  return (
    <div>
      <span className="govuk-caption-l">{profile.firstName} {profile.lastName}</span>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Header title={<Snippet>{`title.${titleKey}`}</Snippet>} />
          {content.fields[contentKey]?.desc && <span className="govuk-heading-s"><Snippet>{`fields.${contentKey}.desc`}</Snippet></span>}
          <Form renderers={renderers} cancelLink="profile.read"></Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
