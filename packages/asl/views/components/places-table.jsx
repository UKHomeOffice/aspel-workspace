const React = require('react');

const Acronym = require('./acronym');
const Join = require('./join');

class PlacesTable extends React.Component {

  renderNACWO(nacwo) {
    if (!nacwo) {
      return <td>-</td>
    }
    return <td><a href={`/profile/${nacwo.profile.id}`}>{ nacwo.profile.name }</a></td>
  }

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
            { this.props.nacwo !== false && this.renderNACWO(row.nacwo) }
          </tr>
        ))
      }
      </tbody>
    </table>
  }
}

module.exports = PlacesTable;
