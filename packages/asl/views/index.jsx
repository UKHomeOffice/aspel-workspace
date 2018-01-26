const React = require('react');
const Layout = require('./layout');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <h1 className="heading-large">Hello {this.props.name}</h1>
        {
          this.props.establishment && (
            <p>You are associated with establishment <strong>{ this.props.establishment }</strong></p>
          )
        }
        <p>You are { this.props.isInspector ? '' : 'not' } an inspector.</p>
        <p><a className="button button-large" href="/logout">Log out</a></p>
      </Layout>
    );
  }
}

module.exports = Index;