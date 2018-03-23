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
          <th>Site</th>
          { this.props.area && <th>Area</th> }
          <th>Name</th>
          <th>Suitability</th>
          <th>Holding Code</th>
          { this.props.nacwo && <th><Acronym>NACWO</Acronym></th> }
        </tr>
      </thead>
      <tbody>
      {
        this.props.rows.map(row => (
          <React.Fragment key={row.id}>
            <tr>
              <td>{ row.site }</td>
              { this.props.area && <td>{ row.area }</td> }
              <td>{ row.name }</td>
              <td><Join>{ row.suitability.map(a => <Acronym key={a}>{a}</Acronym>) }</Join></td>
              <td><Join>{ row.holding.map(a =><Acronym key={a}>{a}</Acronym>) }</Join></td>
              { this.props.nacwo && this.renderNACWO(row.nacwo) }
            </tr>
          </React.Fragment>
        ))
      }
      </tbody>
    </table>
  }
}

PlacesTable.defaultProps = {
  nacwo: true,
  area: true
};

module.exports = PlacesTable;
