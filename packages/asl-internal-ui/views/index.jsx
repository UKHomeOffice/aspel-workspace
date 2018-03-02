const React = require('react');
const Layout = require('./layout');
const Api = require('./components/api');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>

      </Layout>
    );
  }
}

module.exports = Index;