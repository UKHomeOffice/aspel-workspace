const React = require('react');

const ScreenOnly = require('../helpers/screen-only');

class ExportLink extends React.Component {

  href() {
    let prefix = '?';
    if (typeof window !== 'undefined' && window.location.search) {
      prefix = window.location.search;
    }
    return `${prefix}&pdf=1`;
  }

  render() {
    return <p>
      <a href={this.href()}>Export as PDF</a>
    </p>;
  }

}

module.exports = ScreenOnly(ExportLink);
