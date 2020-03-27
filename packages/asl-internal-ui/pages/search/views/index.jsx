import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Datatable,
  ExpiryDate,
  FilterSummary,
  Header,
  Link,
  Snippet,
  LinkFilter
} from '@asl/components';
import SearchPanel from '../../components/search-panel';
import { projectTitle } from '@asl/pages/pages/common/formatters';

function uppercaseFirst(str) {
  return `${str[0].toUpperCase()}${str.substring(1)}`;
}

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
        return (
          <Fragment>
            <Link page="project.read" establishmentId={project.establishment.id} projectId={project.id} label={projectTitle(project)} />
            { project.isLegacyStub ? ' - Partial record' : '' }
          </Fragment>
        );
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
      format: (date, model) => {
        if (!date || ['revoked', 'transferred'].includes(model.status)) {
          return '-';
        }
        return <ExpiryDate date={date} showNotice={model.status === 'active' ? 11 : false} />;
      }
    }
  }
};

const Index = ({ profile, searchType, searchableModels, searchTerm, hasFilters }) => {
  return (
    <Fragment>
      <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <SearchPanel searchType={searchType} searchableModels={searchableModels} searchTerm={searchTerm} />
          {
            hasFilters && <LinkFilter
              prop="status"
              label="Filter by status:"
              showAllLabel="Show all"
              showAllBefore={false}
              formatter={filter => uppercaseFirst(filter)}
            />
          }
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
  datatable: { filters: { options, active } }
}) => ({ profile, searchType, searchableModels, hasFilters: !!options.length, searchTerm: active });

export default connect(mapStateToProps)(Index);
