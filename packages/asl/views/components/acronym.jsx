const React = require('react');

const dictionary = require('@asl/dictionary');

class Acronym extends React.Component {
  render() {
    if (dictionary[this.props.children]) {
      return <abbr title={dictionary[this.props.children]}>{this.props.children}</abbr>;
    }
    return this.props.children;
  }
}

module.exports = Acronym;
