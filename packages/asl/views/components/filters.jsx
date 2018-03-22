const React = require('react');

const CheckboxGroup = require('govuk-react-components/components/forms/radio-group');

class Filters extends React.Component {

  componentDidMount() {
    const collapsed = {};
    this.props.filters.forEach(filter => {
      this.setState({ [filter.key]: [] });
      collapsed[filter.key] = true;
    });
    this.setState({ collapsed });
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
    if (!this.props.applyButton) {
      this.emitChange(Object.assign({}, this.state, state));
    }
  }

  emitChange(state) {
    this.props.onChange && this.props.onChange(state || this.state);
  }

  getUniqueValues(key) {
    return this.props.data
      .map(r => r[key])
      .reduce((list, values) => {
        return list.concat(values);
      }, [])
      .reduce((list, value) => list.includes(value) ? list : list.concat(value), []);
  }

  toggle(e, key) {
    e.preventDefault();
    const collapsed = this.state.collapsed;
    collapsed[key] = !collapsed[key];
    this.setState({ collapsed });
  }

  clear(e) {
    e.preventDefault();
    const state = {};
    this.props.filters.forEach(filter => {
      this.setState({ [filter.key]: [] });
      state[filter.key] = [];
    });
    this.emitChange(state);
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
            const total = values.length;
            if (total > 4 && this.state && this.state.collapsed[filter.key]) {
              values.splice(4);
            }
            return <div key={filter.key} className={ columnClass }>
              <CheckboxGroup
                name={ filter.key }
                type="checkbox"
                label={ filter.title }
                options={ values.map(value => ({ value, label: filter.label ? filter.label(value) : value })) }
                value={ checked }
                onChange={ (e) => this.onChange(filter.key, e.target.value) }
                />
              {
                this.state && total > 4 && <p>
                  <a href="#" onClick={(e) => this.toggle(e, filter.key)}>{ this.state.collapsed[filter.key] ? 'More' : 'Less' }</a>
                </p>
              }
            </div>
          })
        }
      </div>
      <p className="control-bar">
      {
        this.props.applyButton && <button className="button" onClick={() => this.emitChange()}>Apply filters</button>
      }
      <a href="#" onClick={(e) => this.clear(e)}>Clear filters</a>
      </p>
    </div>

  }
}

module.exports = Filters;