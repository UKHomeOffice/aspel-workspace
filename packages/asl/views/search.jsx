const React = require('react');
const App = require('./layouts/app');
const Page = require('./containers/search');
const { propTypes } = require('./pages/search');

const Search = props => (
  <App { ...props }
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/search.js']}
    exposes={Object.keys(propTypes)}
  >
    <Page />
  </App>
);

module.exports = Search;
