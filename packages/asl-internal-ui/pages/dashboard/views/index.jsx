import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Snippet, Tabs, Link } from '@asl/components';
import Tasklist from '@asl/pages/pages/task/list/views/tasklist';
import DashboardNavigation from '../../components/dashboard-navigation';
import SearchPanel from '../../components/search-panel';

const Index = ({ profile, searchType }) => (
  <Fragment>
    <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />
    <DashboardNavigation tab={0} />
    <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
    <Tasklist displayTabs={false} />
  </Fragment>
);

export default connect(({ static: { profile, searchType } }) => ({ profile, searchType }))(Index);
