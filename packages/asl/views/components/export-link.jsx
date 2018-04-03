const React = require('react');

class ExportLink extends React.Component {

  href() {
    let prefix = '?';
    if (typeof location !== 'undefined' && location.search) {
      prefix = location.search;
    }
    return `${prefix}&pdf=1`;
  }

  render() {
    return <p>
      <a href={this.href()}>Export as PDF</a>
    </p>;
  }

};

module.exports = ExportLink;
