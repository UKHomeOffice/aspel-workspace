const React = require('react');
const Layout = require('./layout');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <h1 className="heading-large">Welcome</h1>
      </Layout>
    );
  }
}

module.exports = Index;