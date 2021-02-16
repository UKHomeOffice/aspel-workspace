import React, { Fragment } from 'react';
import classnames from 'classnames';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import { ExpiryDate, Link, Markdown, Snippet } from '@asl/components';
import ProjectSearchResult from '../views/components/project-search-result';
import { projectTitle } from '@asl/pages/pages/common/formatters';
import projectFormatters from '@asl/pages/pages/project/formatters';

export default {
  establishments: {
    name: {
      format: (name, establishment) => {
        const highlight = get(establishment, `highlight.name[0]`);
        const label = highlight ? <Markdown>{highlight}</Markdown> : name;
        return <Link page="establishment.dashboard" establishmentId={establishment.id} label={label} />;
      }
    },
    licenceNumber: {
      format: (licenceNumber, establishment) => {
        const highlight = get(establishment, `highlight.licenceNumber[0]`);
        return highlight ? <Markdown>{highlight}</Markdown> : licenceNumber;
      }
    },
    status: {
      format: (status, model) => {
        const bad = ['expired', 'transferred', 'revoked'];
        const className = classnames({ badge: true, complete: status === 'active', rejected: bad.includes(status) });
        return <span className={ className }><Snippet>{ `status.${status}` }</Snippet></span>;
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
    name: {
      format: (value, profile) => {
        const name = get(profile, `highlight.name[0]`); // partial match on name
        const firstName = get(profile, `highlight.firstName[0]`, profile.firstName);
        const lastName = get(profile, `highlight.lastName[0]`, profile.lastName);
        const label = name ? <Markdown>{name}</Markdown> : <Markdown>{`${firstName} ${lastName}`}</Markdown>;
        return <Link page="globalProfile" profileId={profile.id} label={label} />;
      }
    },
    email: {
      format: (email, profile) => {
        const highlight = get(profile, `highlight.email[0]`);
        return highlight ? <Markdown>{highlight}</Markdown> : email;
      }
    },
    pilLicenceNumber: {
      format: (pilLicenceNumber, profile) => {
        const highlight = get(profile, `highlight.pilLicenceNumber[0]`);
        return highlight ? <Markdown>{highlight}</Markdown> : pilLicenceNumber;
      }
    },
    establishments: {
      format: (establishments, profile) => {
        if (profile.asruUser) {
          return 'ASRU';
        }
        return sortBy(establishments, 'name').map(establishment => (
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
        const highlight = get(project, 'highlight.title[0]');
        const label = highlight ? <Markdown>{highlight}</Markdown> : projectTitle(project);
        return (
          <Fragment>
            <Link page="project.read" establishmentId={project.establishment.id} projectId={project.id} label={label} />
            { project.isLegacyStub ? ' - Partial record' : '' }
          </Fragment>
        );
      }
    },
    licenceNumber: {
      format: (licenceNumber, project) => {
        const highlight = get(project, `highlight.licenceNumber[0]`);
        return highlight ? <Markdown>{highlight}</Markdown> : licenceNumber;
      }
    },
    establishment: {
      format: (establishment, project) => {
        const highlight = get(project, `highlight['establishment.name'][0]`);
        const label = highlight ? <Markdown>{highlight}</Markdown> : establishment.name;
        return <Link page="establishment.dashboard" establishmentId={establishment.id} label={label} />;
      }
    },
    status: projectFormatters().status,
    licenceHolder: {
      format: (profile, project) => {
        const firstName = get(project, `highlight['licenceHolder.firstName'][0]`, profile.firstName);
        const lastName = get(project, `highlight['licenceHolder.lastName'][0]`, profile.lastName);
        const label = <Markdown>{`${firstName} ${lastName}`}</Markdown>;
        return <Link page="globalProfile" profileId={profile.id} label={label} />;
      }
    },
    expiryDate: {
      format: (date, model) => {
        if (!date || ['revoked', 'transferred'].includes(model.status)) {
          return '-';
        }
        return <ExpiryDate
          date={date}
          dateFormat="D MMM YYYY"
          showNotice={model.status === 'active' ? 11 : false}
        />;
      }
    }
  },
  'projects-content': {
    title: {
      format: (title, project) => <ProjectSearchResult project={project} />
    }
  }
};
