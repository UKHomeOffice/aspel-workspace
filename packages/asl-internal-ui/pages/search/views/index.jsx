import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Datatable, ExpiryDate, FilterSummary, Header, Link, Snippet } from '@asl/components';
import SearchPanel from '../../components/search-panel';

const formatters = {
  establishments: {
    name: {
      format: (name, establishment) => {
        return <Link page="establishment.dashboard" establishmentId={establishment.id} label={name} />;
      }
    },
    inspector: {
      format: (inspector, establishment) => {
        return establishment.asru.filter(p => p.asruInspector).map(({ firstName, lastName }) => (`${firstName} ${lastName}`));
      }
    },
    spoc: {
      format: (spoc, establishment) => {
        return establishment.asru.filter(p => p.asruLicensing).map(({ firstName, lastName }) => (`${firstName} ${lastName}`));
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
      format: (establishments, profile) => {
        if (profile.asruUser) {
          return 'ASRU';
        }
        return establishments.map(establishment => {
          return (
            <Fragment key={establishment.id}>
              <Link page="establishment.dashboard" establishmentId={establishment.id} label={establishment.name} />
              <br />
            </Fragment>
          );
        });

      }
    }
  },
  projects: {
    title: {
      format: (title, project) => {
        return <Link page="project.read" establishmentId={project.establishment.id} projectId={project.id} label={title} />;
      }
    },
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
