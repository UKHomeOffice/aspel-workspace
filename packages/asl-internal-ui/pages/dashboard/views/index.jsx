import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Snippet } from '@asl/components';
import Tasklist from '@asl/pages/pages/task/list/views/tasklist';
import DashboardNavigation from '../../components/dashboard-navigation';

const Index = ({ profile }) => (
  <Fragment>
    <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />
    <DashboardNavigation tab={0} />
    <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
    <Tasklist />
  </Fragment>
);

export default connect(({ static: { profile } }) => ({ profile }))(Index);
