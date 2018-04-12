const React = require('react');
const App = require('./layouts/app');
const connect = require('../src/helpers/connector');
const FilterTable = require('./components/filter-table');
const Acronym = require('./components/acronym');

const formatters = {
  type: {
    format: role => <Acronym>{role.toUpperCase()}</Acronym>,
    title: () => 'Role'
  },
  places: { format: places => places.length || '-' },
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
    <h2 className="headline">{name}</h2>
    <h1>Named people</h1>
    <FilterTable schema={ schema } formatters={ formatters } data={ filtered } />
  </App>
);

module.exports = connect(Roles, 'list');
