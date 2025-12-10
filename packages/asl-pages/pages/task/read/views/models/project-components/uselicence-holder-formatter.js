import React, { Fragment } from 'react';
import { Link } from '@ukhomeoffice/asl-components';

export const useLicenceHolderFormatter = (establishment) => {
  return {
    licenceHolder: {
      format: (licenceHolder) => {
        if (!licenceHolder) {
          return '-';
        }
        return (
          <Fragment>
            <Link
              page="profile.read"
              establishmentId={establishment.id}
              profileId={licenceHolder.id}
              label={`${licenceHolder.firstName} ${licenceHolder.lastName}`}
            />
            <br />
            <a href={`mailto:${licenceHolder.email}`}>{licenceHolder.email}</a>
          </Fragment>
        );
      }
    }
  };
};

export default useLicenceHolderFormatter;
