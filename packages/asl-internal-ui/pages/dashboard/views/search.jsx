import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Datatable, FilterSummary, Header, Snippet } from '@asl/components';
import SearchPanel from '../../components/search-panel';

const Index = ({ profile, searchType }) => (
  <Fragment>
    <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <SearchPanel searchType={searchType} />
        <FilterSummary />
        <Datatable />
      </div>
    </div>

  </Fragment>
);

const mapStateToProps = ({
  static: { profile, searchType }
}) => ({ profile, searchType });

export default connect(mapStateToProps)(Index);
