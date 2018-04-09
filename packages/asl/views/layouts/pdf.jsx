const React = require('react');

const Pdf = ({
  hostname,
  children
}) => (
  <html>
    <head>
      <link href={`${hostname}/public/css/app.css`} rel="stylesheet" />
    </head>
    <body>
      <main className="main" id="content">
        { children }
      </main>
    </body>
  </html>
);

module.exports = Pdf;
