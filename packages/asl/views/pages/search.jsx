const React = require('react');
const PropTypes = require('prop-types');

const dictionary = require('@asl/dictionary');

const Input = require('govuk-react-components/components/forms/input-text');

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
        key: 'suitability',
        title: 'Suitability code',
        match: (value, test) => value.includes(test),
        label: code => `${dictionary[code]} (${code})`,
        combines: 'AND'
      },
      {
        key: 'holding',
        title: 'Holding code',
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
    if (this.state && this.state.textFilter) {
      rows = rows.filter(row => {
        return row.site.toLowerCase().includes(this.state.textFilter) || row.name.toLowerCase().includes(this.state.textFilter);
      });
    }
    return rows || [];
  };

  setTextFilter(textFilter) {
    this.setState({ textFilter })
  }

  render() {
    return <React.Fragment>
      <h2 className="headline">{this.props.establishment.name}</h2>
      <h1>Licensed premises</h1>
      <Filters data={this.props.places} filters={this.filters()} onChange={(filters) => this.onFilterChange(filters)} />
      <div  className="text-filter">
        <Input name="filter" onChange={(e) => this.setTextFilter(e.target.value)} label="Search" />
      </div>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Area</th>
            <th>Suitability</th>
            <th>Holding Code</th>
          </tr>
        </thead>
        <tbody>
        {
          this.filtered(this.props.places).map(place => (
            <tr key={place.id}>
              <td>{ place.site }</td>
              <td>{ place.name }</td>
              <td><Join>{ place.suitability.map(a => <Acronym>{a}</Acronym>) }</Join></td>
              <td><Join>{ place.holding.map(a =><Acronym>{a}</Acronym>) }</Join></td>
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
  places: PropTypes.array
};

module.exports = Places;