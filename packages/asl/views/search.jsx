const React = require('react');
const Layout = require('./layouts/default');
const Page = require('./containers/search');
const { propTypes } = require('./pages/search');

const Search = props => (
  <Layout { ...props }
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/search.js']}
    exposes={Object.keys(propTypes)}
  >
    <Page />
  </Layout>
);

module.exports = Search;
