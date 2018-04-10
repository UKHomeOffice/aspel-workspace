const React = require('react');

const Api = ({
  url,
  status,
  data
}) => (
  <details>
    <summary>API Details</summary>
    <h3>URL:</h3>
    <pre className="code">
      { url }
    </pre>
    <h3>Status:</h3>
    <pre className="code">
      { status }
    </pre>
    <h3>Data:</h3>
    <pre className="code">
      { data }
    </pre>
  </details>
);

module.exports = Api;
