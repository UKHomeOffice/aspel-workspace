const React = require('react');
const PropTypes = require('prop-types');

const dictionary = require('@asl/dictionary');

const Acronym = require('../components/acronym');
const Filters = require('../components/filters');
class Join extends React.Component {

  render() {
    const sep = this.props.separator || ', ';
    return React.Children.toArray(this.props.children).reduce((list, item, i) => {
      if (i) {
        list.push(sep);
      }
      return list.concat(item);
    }, []);
  }

}

class Places extends React.Component {

  filters() {
    return [
      {
        key: 'site',
        title: 'Location',
        match: (value, test) => value === test
      },
      {
        key: 'holding',
        title: 'Holding code',
        match: (value, test) => value.includes(test),
        label: code => `${dictionary[code]} (${code})`,
        combines: 'AND'
      },
      {
        key: 'suitability',
        title: 'Suitability code',
        match: (value, test) => value.includes(test),
        label: code => `${dictionary[code]} (${code})`,
        combines: 'AND'
      }
    ];
  }

  onFilterChange(filters) {
    this.setState({ filters });
  }

  matches(filter, row, values) {
    if (!values.length) {
      return true;
    }
    if (filter.combines === 'AND') {
      return values.reduce((matched, value) => {
        return matched && filter.match(row[filter.key], value);
      }, true);
    }
    return values.reduce((matched, value) => {
      return matched || filter.match(row[filter.key], value);
    }, false);
  }

  filtered(rows) {
    const filters = this.filters();
    if (this.state && this.state.filters) {
      rows = rows.filter(row => {
        return filters.reduce((matches, filter) => {
          return matches && this.matches(filter, row, this.state.filters[filter.key]);
        }, true);
      });
    }
    return rows || [];
  };

  render() {
    return <React.Fragment>
      <h2 className="headline">{this.props.establishment.name}</h2>
      <h1>Licensed premises</h1>
      <Filters data={this.props.places} filters={this.filters()} onChange={(filters) => this.onFilterChange(filters)} applyButton={this.props.applyButton} />
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Area</th>
            <th>Holding Code</th>
            <th>Suitability</th>
          </tr>
        </thead>
        <tbody>
        {
          this.filtered(this.props.places).map(place => (
            <tr key={place.id}>
              <td>{ place.site }</td>
              <td>{ place.name }</td>
              <td><Join>{ place.holding.map(a =><Acronym>{a}</Acronym>) }</Join></td>
              <td><Join>{ place.suitability.map(a => <Acronym>{a}</Acronym>) }</Join></td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </React.Fragment>
  }
}

Places.propTypes = {
  establishment: PropTypes.object,
  places: PropTypes.array,
  applyButton: PropTypes.bool
};

module.exports = Places;