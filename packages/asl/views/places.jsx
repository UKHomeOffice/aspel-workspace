const React = require('react');
const App = require('./layouts/app');
const Page = require('./containers/places');
const { propTypes } = require('./pages/places');

const Places = props => (
  <App { ...props }
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/places.js']}
    exposes={Object.keys(propTypes)}
  >
    <Page />
  </App>
);

module.exports = Places;
