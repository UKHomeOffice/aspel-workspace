const React = require('react');

const dictionary = require('./dictionary');

class Acronym extends React.Component {
  render() {
    if (dictionary[this.props.children]) {
      return <abbr title={dictionary[this.props.children]}>{this.props.children}</abbr>
    }
    return <span>{this.props.children}</span>
  }
}

module.exports = Acronym;