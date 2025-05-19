import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, TrainingSummary, Details, Inset, SupportingLinks, Link, ErrorSummary } from '@ukhomeoffice/asl-components';

const Page = () => {
  const {profile} = useSelector(state => state.static, shallowEqual);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ErrorSummary />
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
        <Header title={<Snippet>title</Snippet>} />
        <Form cancelLink="profile.read">
        </Form>
      </div>

    </div>
  );
};

export default Page;

