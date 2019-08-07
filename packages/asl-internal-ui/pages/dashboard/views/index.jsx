import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Snippet } from '@asl/components';
import Tasklist from '@asl/pages/pages/task/list/views/tasklist';
import SearchPanel from '../../components/search-panel';

const Index = ({ profile, searchType }) => (
  <Fragment>
    <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />
    <SearchPanel searchType={searchType} action={`/search/${searchType}`} />
    <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
    <Tasklist />
  </Fragment>
);

export default connect(({ static: { profile, searchType } }) => ({ profile, searchType }))(Index);
