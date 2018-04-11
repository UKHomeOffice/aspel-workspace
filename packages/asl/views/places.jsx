const React = require('react');
const { merge, pickBy } = require('lodash');
const App = require('./layouts/app');
const connect = require('../src/helpers/connector');
const TextFilter = require('./containers/text-filter');
const ListTable = require('./components/list-table');
const ExportLink = require('./containers/export-link');
const {
  joinAcronyms,
  renderNacwo,
  acronym
} = require('./helpers');

const formatters = {
  suitability: {
    format: joinAcronyms
  },
  holding: {
    format: joinAcronyms
  },
  nacwo: {
    format: renderNacwo,
    title: key => acronym(key.toUpperCase())
  }
};

const Places = ({
  store,
  establishment: { name },
  list: { schema, filtered }
}) => (
  <App
    store={store}
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/places.js']}
  >
    <h2 className="headline">{name}</h2>
    <h1>Licensed premises</h1>
    <TextFilter />
    <ListTable schema={merge({}, pickBy(schema, v => v.show), formatters)} data={filtered} />
    <ExportLink />
  </App>
);

module.exports = connect(Places, 'list');
