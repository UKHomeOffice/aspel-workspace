const React = require('react');
const Layout = require('./layouts/default');
const Page = require('./containers/places');
const { propTypes } = require('./pages/places');

const Places = props => (
  <Layout { ...props }
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/places.js']}
    exposes={Object.keys(propTypes)}
  >
    <Page />
  </Layout>
);

module.exports = Places;
