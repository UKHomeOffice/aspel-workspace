import React, { Fragment } from 'react';
import { Link } from '@ukhomeoffice/asl-components';

export function EstablishmentLink({ establishment }) {
  return (
    <Fragment>
      <dt>Establishment</dt>
      <dd>
        <Link page="establishment" establishmentId={establishment.id} label={`${establishment.name}`} />
        { establishment.status === 'inactive' && <span> (Draft)</span> }
      </dd>
    </Fragment>
  );
}
