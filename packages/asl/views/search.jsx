const React = require('react');
const App = require('./layouts/app');
const Page = require('./containers/search');

const Search = props => (
  <App { ...props }
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/search.js']}
  >
    <Page />
  </App>
);

module.exports = Search;
