const React = require('react');
const Layout = require('./layout');
const Api = require('./components/api');
const Acronym = require('./components/acronym');
const Join = require('./components/join');

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
      return <div>
        <h3>{this.roleName(role.type)}</h3>
        {
          !!role.places.length && <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Site</th>
                <th>Building</th>
                <th>Floor</th>
                <th>Holding Code</th>
                <th>Suitability</th>
              </tr>
            </thead>
            <tbody>
            {
              role.places.map(place => (
                <tr>
                  <td>{ place.id }</td>
                  <td>{ place.name }</td>
                  <td>{ place.site }</td>
                  <td>{ place.building }</td>
                  <td>{ place.floor }</td>
                  <td><Join>{ place.holding.map(a => <Acronym key={a}>{a}</Acronym>) }</Join></td>
                  <td><Join>{ place.suitability.map(a => <Acronym key={a}>{a}</Acronym>) }</Join></td>
                </tr>
              ))
            }
            </tbody>
          </table>
        }
      </div>
    })
  }

  render() {
    return (
      <Layout {...this.props}>
        <div>
          <h1>{this.props.profile.name}</h1>
          <h2><a href="/">{ this.props.establishment.name }</a></h2>
          <p>Email: { this.props.profile.email }</p>
          <p>Phone: { this.props.profile.telephone }</p>
          <h2>Roles</h2>
          { this.renderRoles() }
        </div>
      </Layout>
    );
  }
}

module.exports = Roles;