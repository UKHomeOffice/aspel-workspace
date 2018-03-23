const React = require('react');

const Acronym = require('./acronym');
const Join = require('./join');

class PlacesTable extends React.Component {
  render() {
    return <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Name</th>
          <th>Suitability</th>
          <th>Holding Code</th>
          { this.props.nacwo !== false && <th><Acronym>NACWO</Acronym></th> }
        </tr>
      </thead>
      <tbody>
      {
        this.props.rows.map(row => (
          <tr key={row.id}>
            <td>{ row.site }</td>
            <td>{ row.name }</td>
            <td><Join>{ row.suitability.map(a => <Acronym>{a}</Acronym>) }</Join></td>
            <td><Join>{ row.holding.map(a =><Acronym>{a}</Acronym>) }</Join></td>
            { this.props.nacwo !== false && <td><a href={`/profile/${row.nacwo.profile.id}`}>{ row.nacwo.profile.name }</a></td> }
          </tr>
        ))
      }
      </tbody>
    </table>
  }
}

module.exports = PlacesTable;
