import React, { Fragment } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Snippet, Header, Form, ErrorSummary } from '@ukhomeoffice/asl-components';
import { Warning } from '@ukhomeoffice/react-components';

const Page = () => {
  const {profile, roleType} = useSelector(state => state.static, shallowEqual);

  let declaration;
  if (roleType === 'NVS') {
    declaration = (
      <Fragment>
        <Warning>They must complete the NVS module and add it to their training record within 12 months of starting the
          role</Warning>
      </Fragment>
    );
  }

  const renderers = {
    delayReason: {
      propMappers: {
        label: () => <Snippet fallback='fields.delayReason.label.default'>fields.delayReason.label.{roleType}</Snippet>,
        error: () => <Snippet fallback='errors.delayReason.required.default'>errors.delayReason.required.{roleType}</Snippet>
      }
    },
    completeDate: {
      propMappers: {
        label: () => <Snippet fallback='fields.completeDate.label.default'>fields.completeDate.label.{roleType}</Snippet>
      }
    }
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ErrorSummary renderers={renderers} />
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
        <Header title={<Snippet fallback='title.default'>{ `title.${roleType}` }</Snippet>} />
        <Form renderers={renderers} cancelLink="profile.read" declaration={declaration}>
        </Form>
      </div>

    </div>
  );
};

export default Page;
