import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form } from '@ukhomeoffice/asl-components';
import content from '../content/skills-and-experience';

const Page = () => {

  const { profile, roleType } = useSelector(state => state.static, shallowEqual);
  const roleKey = (roleType || '').toLowerCase();
  const renderers = {};

  for (const key of Object.keys(content.fields[roleKey] || {})) {
    renderers[key] = {
      propMappers: {
        label: () => <Snippet>{`fields.${roleKey}.${key}.label`}</Snippet>,
        hint: () => <Snippet>{`fields.${roleKey}.${key}.hint`}</Snippet>,
        error: () => <Snippet>{`errors.fields.${roleKey}.${key}.required`}</Snippet>
      }
    };
  }

  return (
    <div>
      <span className="govuk-caption-l">{profile.firstName} {profile.lastName}</span>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Header title={<Snippet>title</Snippet>} />
          {content.fields[roleKey]?.desc && <span className="govuk-heading-s"><Snippet>{`fields.${roleKey}.desc`}</Snippet></span>}
          <Form renderers={renderers} cancelLink="profile.read"></Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
