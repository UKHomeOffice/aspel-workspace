import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Link, Snippet } from '@asl/components';
import Tasklist from '@asl/pages/pages/task/list/views/tasklist';
import DashboardNavigation from '../../components/dashboard-navigation';

const Index = ({ profile }) => (
  <Fragment>
    <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />
    <DashboardNavigation tab={0} />
    <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
    <Link page="search" searchType="tasks" label={<Snippet>tasklist.searchTasks</Snippet>} query={{ filters: { progress: ['open'] } }} />
    <Tasklist />
  </Fragment>
);

export default connect(({ static: { profile } }) => ({ profile }))(Index);
