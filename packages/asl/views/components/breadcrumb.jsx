const React = require('react');

const Breadcrumb = ({
  crumb
}) => typeof crumb === 'string'
  ? <li>{crumb}</li>
  : <li>
    <a href={crumb.href}>{crumb.label}</a>
  </li>;

module.exports = Breadcrumb;
