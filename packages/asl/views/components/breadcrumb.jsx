const React = require('react');

class Breadcrumb extends React.Component {
  render() {
    if (!this.props.crumbs || !this.props.crumbs.length || !Array.isArray(this.props.crumbs)) {
      return null;
    }
    const crumbs = [].concat([{ label: 'Home', href: '/' }], this.props.crumbs);
    return <div className="breadcrumb">
      <ol>
        {
          crumbs.map(crumb => {
            if (typeof crumb === 'string') {
              return <li key={crumb}>{crumb}</li>
            } else if (typeof crumb.href === 'string' && typeof crumb.label === 'string') {
              return <li key={crumb.href}><a href={crumb.href}>{crumb.label}</a></li>
            }
          })
        }
      </ol>
    </div>
  }
}

module.exports = Breadcrumb;