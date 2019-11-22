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
        return establishment.asru.filter(p => p.asruInspector).map(profile => (
          <p key={profile.id}>{`${profile.firstName} ${profile.lastName}`}</p>
        ));
      }
    },
    spoc: {
      format: (spoc, establishment) => {
        return establishment.asru.filter(p => p.asruLicensing).map(profile => (
          <p key={profile.id}>{`${profile.firstName} ${profile.lastName}`}</p>
        ));
      }
    }
  },
  profiles: {
    lastName: {
      format: (lastName, profile) => {
        return <Link page="globalProfile" profileId={profile.id} label={`${profile.firstName} ${lastName}`} />;
      }
    },
    establishments: {
      format: (establishments, profile) => {
        if (profile.asruUser) {
          return 'ASRU';
        }
        return establishments.map(establishment => (
          <p key={establishment.id}>
            <Link page="establishment.dashboard" establishmentId={establishment.id} label={establishment.name} />
          </p>
        ));
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
        return <Link page="globalProfile" profileId={id} label={`${firstName} ${lastName}`} />;
      }
    },
    expiryDate: {
      format: date => {
        return date ? <ExpiryDate date={date} showNotice={11} /> : '-';
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

      {
        searchType === 'establishments' &&
          <Link page="createEstablishment" label={<Snippet>actions.establishment.create</Snippet>} className="govuk-button button-secondary" />
      }

    </Fragment>
  );
};

const mapStateToProps = ({
  static: { profile, searchType, searchableModels },
  datatable: { filters }
}) => ({ profile, searchType, searchableModels, filters });

export default connect(mapStateToProps)(Index);
