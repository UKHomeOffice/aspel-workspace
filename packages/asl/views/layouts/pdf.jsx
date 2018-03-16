const React = require('react');

class Pdf extends React.Component {
  render() {
    return (
      <html>
        <head>
          <link href={`${this.props.hostname}/public/css/app.css`} rel="stylesheet" />
        </head>
        <body>

          <main className="main" id="content">
            { this.props.children }
          </main>
        </body>
      </html>
    );
  }
}

module.exports = Pdf;