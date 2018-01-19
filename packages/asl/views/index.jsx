const React = require('react');
const Layout = require('./layout');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <h1 className="heading-large">Hello {this.props.user.firstName}</h1>
        <p><a className="button button-large" href="/logout">Log out</a></p>
      </Layout>
    );
  }
}

module.exports = Index;