const React = require('react');
const App = require('./layouts/app');
const connect = require('../src/helpers/connector');
const TextFilter = require('./containers/text-filter');
const PlacesTable = require('./containers/places-table');
const ExportLink = require('./containers/export-link');

const Places = props => (
  <App { ...props }
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/places.js']}
  >
    <h2 className="headline">{props.establishment.name}</h2>
    <h1>Licensed premises</h1>
    <TextFilter />
    <PlacesTable />
    <ExportLink />
  </App>
);

module.exports = connect(Places);
