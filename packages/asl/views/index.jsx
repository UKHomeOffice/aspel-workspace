const React = require('react');
const Layout = require('./layout');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <h1>User: {this.props.name}</h1>
        {
          this.props.establishment ? (
            <div>
              <h2>API</h2>
              <h3>URL:</h3>
              <pre className="code">
                { this.props.url }
              </pre>
              <h3>Status:</h3>
              <pre className="code">
                { this.props.status }
              </pre>
              <h3>Data:</h3>
              <pre className="code">
                { this.props.data }
              </pre>
            </div>
          ) : <p>No associated establishment</p>
        }
        <p>
          <a className="button button-large" href="/logout">Log out</a>
        </p>
        <p>
          <a className="button button-large" href="https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/Asl-dev/account">Manage account</a>
        </p>
      </Layout>
    );
  }
}

module.exports = Index;