const React = require('react');
const App = require('./layouts/app');

class Index extends React.Component {
  render() {
    return (
      <App {...this.props}>
        <h1 className="heading-large">{this.props.error.message}</h1>
        <pre>
          {this.props.error.stack}
        </pre>
      </App>
    );
  }
}

module.exports = Index;
