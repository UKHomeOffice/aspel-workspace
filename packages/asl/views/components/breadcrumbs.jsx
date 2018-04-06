const React = require('react');
const Breadcrumb = require('./breadcrumb');

const renderNull = crumbs => !crumbs || !crumbs.length || !Array.isArray(crumbs);

const Breadcrumbs = ({
  crumbs
}) => {
  if (renderNull(crumbs)) {
    return null;
  }
  crumbs = [ { label: 'Home', href: '/' }, ...crumbs ];
  return <div className="breadcrumb">
    <ol>
      {
        crumbs.map((crumb, index) =>
          <Breadcrumb key={index} crumb={crumb} />
        )
      }
    </ol>
  </div>;
};

module.exports = Breadcrumbs;
