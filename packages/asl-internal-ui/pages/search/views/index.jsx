import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Datatable, FilterSummary, Header, Snippet } from '@asl/components';
import SearchPanel from '../../components/search-panel';

const formatters = {
  establishments: {},
  profiles: {
    lastName: {
      format: (lastName, profile) => `${profile.firstName} ${lastName}`
    },
    establishments: {
      format: establishments => establishments.map(establishment => establishment.name).join(', ')
    }
  },
  projects: {}
};

const Index = ({ profile, searchType, searchableModels, filters }) => {
  return (
    <Fragment>
      <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <SearchPanel searchType={searchType} searchableModels={searchableModels} />

          { filters.active['*'] &&
            <Fragment>
              <FilterSummary />
              <Datatable formatters={formatters[searchType]} />
            </Fragment>
          }

        </div>
      </div>

    </Fragment>
  );
};

const mapStateToProps = ({
  static: { profile, searchType, searchableModels },
  datatable: { filters }
}) => ({ profile, searchType, searchableModels, filters });

export default connect(mapStateToProps)(Index);
