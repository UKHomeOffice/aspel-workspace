const React = require('react');
const App = require('./layouts/app');
const Page = require('./containers/places');

const Places = props => (
  <App { ...props }
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/places.js']}
  >
    <Page />
  </App>
);

module.exports = Places;
