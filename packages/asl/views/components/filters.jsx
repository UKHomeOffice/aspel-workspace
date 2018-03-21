const React = require('react');

const CheckboxGroup = require('govuk-react-components/components/forms/radio-group');

class Filters extends React.Component {

  componentDidMount() {
    this.props.filters.forEach(filter => {
      this.setState({ [filter.key]: [] });
    });
  }

  onChange(key, val) {
    const values = this.state[key];
    const state = {};
    if (values.includes(val)) {
      state[key] = values.filter(a => a !== val);
    } else {
      state[key] = values.concat([val]);
    }
    this.setState(state);
    this.props.onChange && this.props.onChange(Object.assign({}, this.state, state));
  }

  getUniqueValues(key) {
    return this.props.data
      .map(r => r[key])
      .reduce((list, values) => {
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
            const checked = this.state ? this.state[filter.key] : [];
            const values = this.getUniqueValues(filter.key);
            return <div key={filter.key} className={ columnClass }>
              <CheckboxGroup
                name={ filter.key }
                type="checkbox"
                label={ filter.label }
                options={ values }
                value={ checked }
                onChange={ (e) => this.onChange(filter.key, e.target.value) }
                />
            </div>
          })
        }
      </div>
    </div>

  }
}

module.exports = Filters;