const React = require('react');
const Layout = require('./layout');
const Api = require('./components/api');

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
      <Layout {...this.props}>
        {
          this.props.establishment ? (
            <div>
              <h1><a href="/">{this.props.establishment.name}</a></h1>
              <h2>People</h2>
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
                    <tr>
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