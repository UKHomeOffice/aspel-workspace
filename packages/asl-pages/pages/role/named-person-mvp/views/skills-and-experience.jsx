import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form } from '@ukhomeoffice/asl-components';
import content from '../content/skills-and-experience';

const Page = () => {

  const { profile, roleType } = useSelector(state => state.static, shallowEqual);

  const renderers = () => (
    Object.keys(content.fields).map(key => ({
      [key]: {
        propMappers: {
          label: () => <Snippet>{`fields.${key}.label`}</Snippet>,
          hint: () => <Snippet>{`fields.${key}.hint`}</Snippet>,
          error: () => <Snippet>{`errors.${key}.required`}</Snippet>
        }
      }
    })));

  return (
    <div>
      <span className="govuk-caption-l">{profile.firstName} {profile.lastName}</span>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Header title={<Snippet>title</Snippet>} />
          <span className="govuk-heading-s"><Snippet>desc</Snippet></span>
          <Form renderers={renderers} cancelLink="profile.read"></Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
