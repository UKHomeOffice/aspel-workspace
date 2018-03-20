const React = require('react');

const CheckboxGroup = require('govuk-react-components/components/forms/radio-group');

class Filters extends React.Component {

  getUniqueValues(key) {
    return this.props.data
      .map(r => r[key])
      .reduce((list, values) => {
        console.log(values);
        return list.concat(values);
      }, [])
      .reduce((list, value) => list.includes(value) ? list : list.concat(value), []);
  }

  render() {

    if (!this.props.filters || !this.props.filters.length) {
      return null;
    }

    const columnClass = [null, 'column-full', 'column-half', 'column-one-third'][this.props.filters.length];

    return <div className="filter-panel">
      <h3>Filter by</h3>
      <div className="grid-row">
        {
          this.props.filters.map(filter => {
            return <div key={filter.key} className={ columnClass }>
              <CheckboxGroup
                name={ filter.key }
                type="checkbox"
                label={ filter.label }
                options={ this.getUniqueValues(filter.key) }
                />
            </div>
          })
        }
      </div>
    </div>

  }
}

module.exports = Filters;