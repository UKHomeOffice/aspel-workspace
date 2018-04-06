const React = require('react');

const Join = ({
  separator = ', ',
  children
}) => React.Children.toArray(children).reduce((list, item, i) => {
  if (i) {
    list.push(separator);
  }
  return list.concat(item);
}, []);

module.exports = Join;
