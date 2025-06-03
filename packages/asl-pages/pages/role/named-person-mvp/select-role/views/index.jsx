import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Snippet, FormLayout } from '@ukhomeoffice/asl-components';
import OpenTasks from '../../../component/open-tasks';

const Page = ({ addRoleTasks, schema, profile }) => {
  if (schema.type.options.length === 0) {
    return (
      <Fragment>
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
        <OpenTasks roleTasks={addRoleTasks} />
        <p>
          <Link page="profile.read" label={<Snippet>buttons.cancel</Snippet>} className="govuk-button" />
        </p>
      </Fragment>
    );
  }

  const CancelLink = () => {
    return <Link page="profile.read" label={<Snippet>buttons.cancel</Snippet>} />;
  };

  return (
    <Fragment>
      <FormLayout cancelLink={<CancelLink />}>
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
        <OpenTasks roleTasks={addRoleTasks} />
      </FormLayout>
    </Fragment>
  );
};

const mapStateToProps = ({ static: { addRoleTasks, schema, profile } }) => ({ addRoleTasks, schema, profile });
export default connect(mapStateToProps)(Page);
