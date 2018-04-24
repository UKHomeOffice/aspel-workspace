import React from 'react';
import DataTable from 'govuk-react-components/components/datatable';
import { merge, omit } from 'lodash';
import App from './layouts/app';
import connect from '../src/helpers/connector';
import dictionary from '@asl/dictionary';

import { formatters } from './places';

const Roles = ({
  store,
  establishment: {
    name: establistmentName
  },
  profile: {
    name,
    email,
    telephone,
    address,
    qualifications,
    notes,
    roles
  },
  list: {
    schema
  }
}) => (
  <App store={store}
    crumbs={[{ href: '/roles', label: 'Named people' }, name]}
    scripts={['/public/js/pages/profile.js']}
  >
    <h2 className="headline">{ establistmentName }</h2>
    <h1>{name}</h1>

    <dl>
      <dt>Email</dt>
      <dd>{ email }</dd>

      <dt>Phone</dt>
      <dd>{ telephone }</dd>

      <dt>Address</dt>
      <dd>{ address }</dd>

      <dt>Qualifications</dt>
      <dd>{ qualifications }</dd>

      <dt>Notes</dt>
      <dd>{ notes }</dd>
    </dl>

    <h2>Roles</h2>
    {
      roles.map(({ id, type, places }) =>
        <React.Fragment key={ id }>
          <h3>{ dictionary[type] || dictionary[type.toUpperCase() || type] }</h3>
          {
            !!places.length && <DataTable data={ places } schema={ merge({}, schema, { nacwo: { show: false } }) } formatters={ omit(formatters, 'nacwo') } />
          }
        </React.Fragment>
      )
    }
  </App>
);

export default connect(Roles, 'profile', 'list');
