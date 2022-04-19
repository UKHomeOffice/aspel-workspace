import React from 'react';
import get from 'lodash/get';
import formatDate from 'date-fns/format';
import { Link } from '@asl/components';

export default {
  subject: {
    format: flag => {
      return flag.profile && `${flag.profile.firstName} ${flag.profile.lastName}`;
    }
  },
  establishment: {
    format: flag => {
      return get(flag, 'establishment.name');
    }
  },
  appliedTo: {
    format: flag => {
      switch (flag.modelType) {
        case 'profile':
          const profile = flag.profile;
          return <Link page="profile.read" profileId={profile.id} label="Profile" />;

        case 'pil':
          const pil = flag.pil;
          return <Link page="pil.read" establishmentId={pil.establishmentId} profileId={pil.profileId} label={`PIL: ${flag.profile.pilLicenceNumber}`} />;

        case 'project':
          const project = flag.project;
          return <Link page="project.read" establishmentId={project.establishmentId} projectId={project.id} label={`PPL: ${project.licenceNumber}`} />;

        case 'establishment':
          const establishment = flag.establishment;
          return <Link page="establishment" establishmentId={establishment.id} label={`PEL: ${establishment.licenceNumber}`} />;
      }
    }
  },
  status: {
    format: flag => {
      return flag.status === 'open' ? 'Ongoing' : 'Closed';
    }
  },
  date: {
    format: value => {
      return <span className="date">{formatDate(value, 'DD MMM YYYY')}</span>;
    }
  }
};
