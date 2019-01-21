import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Snippet } from '@asl/components';
import Tasklist from '@asl/pages/pages/task/list/views/tasklist';
import SearchPanel from '../../components/search-panel';

const Index = ({ profile, searchType, progress, tabs }) => (
  <Fragment>
    <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <SearchPanel searchType={searchType} action={`/search/${searchType}`} />
      </div>
    </div>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
        <Tasklist tabs={tabs} progress={progress} />
      </div>
    </div>
  </Fragment>
);

const mapStateToProps = ({
  static: { profile, searchType, progress, tabs }
}) => ({ profile, searchType, progress, tabs });

export default connect(mapStateToProps)(Index);
