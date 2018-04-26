import React from 'react';
import App from './layouts/app';
import connect from '../src/helpers/connector';
import FilterTable from './components/filter-table';
import dictionary from '@asl/dictionary';

export const formatters = {
  type: {
    format: role => dictionary[role] || dictionary[role.toUpperCase()] || role,
    title: () => 'Role'
  },
  places: { format: places => places || '-' },
  profile: { format: id => <a href={`/profile/${id}`}>View</a> }
};

const Roles = ({
  store,
  establishment: { name },
  list: { schema, filtered }
}) => (
  <App store={store}
    crumbs={['Named people']}
    scripts={['/public/js/pages/roles.js']}
  >
    <header>
      <h2>{name}</h2>
      <h1>Named people</h1>
    </header>
    <FilterTable schema={ schema } formatters={ formatters } data={ filtered } />
  </App>
);

export default connect(Roles, 'list');
