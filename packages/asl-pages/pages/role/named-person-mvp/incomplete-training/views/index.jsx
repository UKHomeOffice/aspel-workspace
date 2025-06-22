import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, ErrorSummary } from '@ukhomeoffice/asl-components';

const Page = () => {
  const {profile} = useSelector(state => state.static, shallowEqual);

  const formatters = {
    declaration: {
      propMappers: {
        label: (_, formatter) => <Snippet {...formatter.renderContext ?? {}}>agreement</Snippet>,
        title: () => <Snippet>fields.declaration.title</Snippet>,
        hint: () => <Snippet fallback='declarations.default'>declarations.{values.type}</Snippet>
      },
      renderContext: {
        agreementDeterminer: ['nacwo', 'nvs'].includes(values.type) ? 'all' : 'both'
      }
    }
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ErrorSummary />
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
        <Header title={<Snippet>title</Snippet>} />
        <Form formatters={formatters} cancelLink="profile.read">
        </Form>
      </div>

    </div>
  );
};

export default Page;
