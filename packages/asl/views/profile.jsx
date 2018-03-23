const React = require('react');
const Layout = require('./layouts/default');

const PlacesTable = require('./components/places-table')

const dictionary = require('@asl/dictionary');

class Roles extends React.Component {

  roleName(type) {
    const dict = Object.assign({}, dictionary, {
      elh: 'Establishment Licence Holder'
    });
    return dict[type] || dict[type.toUpperCase()] || type;
  }

  renderRoles() {
    return this.props.profile.roles.map(role => {
      return <React.Fragment>
        <h3>{this.roleName(role.type)}</h3>
        {
          !!role.places.length && <PlacesTable rows={role.places} nacwo={false} />
        }
      </React.Fragment>
    })
  }

  render() {
    return (
      <Layout {...this.props} crumbs={[{ href: '/roles', label: 'Named people' }, this.props.profile.name]}>

        <h2 className="headline">{ this.props.establishment.name }</h2>
        <h1>{this.props.profile.name}</h1>

        <dl>
          <dt>Email</dt>
          <dd>{this.props.profile.email}</dd>

          <dt>Phone</dt>
          <dd>{this.props.profile.telephone}</dd>

          <dt>Address</dt>
          <dd>{this.props.profile.address}</dd>

          <dt>Qualifications</dt>
          <dd>{this.props.profile.qualifications}</dd>

          <dt>Notes</dt>
          <dd>{this.props.profile.notes}</dd>
        </dl>

        <h2>Roles</h2>
        { this.renderRoles() }
      </Layout>
    );
  }
}

module.exports = Roles;