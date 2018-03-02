const React = require('react');

class Api extends React.Component {
  render() {
    return (
      <details>
        <summary>API Details</summary>
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
      </details>
    );
  }
}

module.exports = Api;