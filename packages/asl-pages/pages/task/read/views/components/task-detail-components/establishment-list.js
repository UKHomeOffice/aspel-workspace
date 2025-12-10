import React, { Fragment } from 'react';
import { Link } from '@ukhomeoffice/asl-components';

export function EstablishmentsList({ establishments }) {
  return (
    <Fragment>
      <dt>Establishments</dt>
      <dd>
        <ul className="establishments">
          {
            (establishments || []).map(e =>
              <li key={e.id}><Link page="establishment" establishmentId={e.id} label={`${e.name}`} /></li>
            )
          }
        </ul>
      </dd>
    </Fragment>
  );
}
