import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Link,
  Snippet,
  Header
} from '@asl/components';
import Tasklist from '@asl/pages/pages/task/list/views/tasklist';

const Index = ({
  profile: {
    firstName,
    establishments
  },
  tasks
}) => (
  <Fragment>
    <Header
      title={<Snippet name={firstName}>pages.dashboard.greeting</Snippet>}
    />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
        <Tasklist />
      </div>
    </div>
  </Fragment>
);

const mapStateToProps = ({ static: { profile, tasks } }) => ({ profile, tasks });
export default connect(mapStateToProps)(Index);
