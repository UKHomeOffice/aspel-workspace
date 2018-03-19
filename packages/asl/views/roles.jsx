const React = require('react');
const Layout = require('./layouts/default');

const dictionary = require('@asl/dictionary')

class Roles extends React.Component {

  roleName(type) {
    const dict = Object.assign({}, dictionary, {
      elh: 'Establishment Licence Holder'
    });
    return dict[type] || dict[type.toUpperCase()] || type;
  }

  render() {
    return (
      <Layout {...this.props} crumbs={['Named people']}>
        {
          this.props.establishment ? (
            <div>
              <h2>{this.props.establishment.name}</h2>
              <h1>Named people</h1>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Places</th>
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.props.roles && this.props.roles.map(role => (
                    <tr key={ role.id }>
                      <td>{ role.profile.name }</td>
                      <td>{ this.roleName(role.type) }</td>
                      <td>{ role.places.length || '-' }</td>
                      <td><a href={`/profile/${role.profile.id}`}>View</a></td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
          ) : <p>No associated establishment</p>
        }
      </Layout>
    );
  }
}

module.exports = Roles;