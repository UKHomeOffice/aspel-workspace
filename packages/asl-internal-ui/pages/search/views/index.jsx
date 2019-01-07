import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Datatable, ExpiryDate, FilterSummary, Header, Link, Snippet } from '@asl/components';
import SearchPanel from '../../components/search-panel';

const formatters = {
  establishments: {
    name: {
      format: (name, establishment) => {
        return <Link page="establishment.read" establishmentId={establishment.id} label={name} />;
      }
    }
  },
  profiles: {
    lastName: {
      format: (lastName, profile) => {
        return <Link page="global.profile" profileId={profile.id} label={`${profile.firstName} ${lastName}`} />;
      }
    },
    establishments: {
      format: establishments => establishments.map((establishment, i) => [
        // separate links with line breaks #hack
        i > 0 && <br />,
        <Link page="establishment.dashboard" establishmentId={establishment.id} label={establishment.name} />
      ])
    }
  },
  projects: {
    establishment: {
      format: establishment => {
        return <Link page="establishment.dashboard" establishmentId={establishment.id} label={establishment.name} />;
      }
    },
    licenceHolder: {
      format: ({ id, firstName, lastName }) => {
        return <Link page="global.profile" profileId={id} label={`${firstName} ${lastName}`} />;
      }
    },
    expiryDate: {
      format: date => {
        return <ExpiryDate date={date}/>;
      }
    }
  }
};

const Index = ({ profile, searchType, searchableModels, filters }) => {
  return (
    <Fragment>
      <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <SearchPanel searchType={searchType} searchableModels={searchableModels} />
          <FilterSummary />
          <Datatable formatters={formatters[searchType]} />
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
