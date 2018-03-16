const React = require('react');
const Layout = require('./layouts/default');
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
                <th>Site</th>
                <th>Building</th>
                <th>Floor</th>
                <th>Name</th>
                <th>Holding Code</th>
                <th>Suitability</th>
              </tr>
            </thead>
            <tbody>
            {
              role.places.map(place => (
                <tr key={place.id}>
                  <td>{ place.site }</td>
                  <td>{ place.building }</td>
                  <td>{ place.floor }</td>
                  <td>{ place.name }</td>
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
        </div>
      </Layout>
    );
  }
}

module.exports = Roles;