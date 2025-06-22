import React, { Fragment } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, ErrorSummary } from '@ukhomeoffice/asl-components';
import { Warning } from '@ukhomeoffice/react-components';

const Page = () => {
  const {profile, roleType} = useSelector(state => state.static, shallowEqual);

  const warning = (
    <Fragment>
      <Warning>They must complete the NVS module and add it to their training record within 12 months of starting the role</Warning>
    </Fragment>
  );

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ErrorSummary />
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
        <Header title={<Snippet>title</Snippet>} />
        <Form cancelLink="profile.read" declaration={warning}>
        </Form>
      </div>

    </div>
  );
};

export default Page;
