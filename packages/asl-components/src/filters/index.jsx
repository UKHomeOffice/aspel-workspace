import React, { Component } from 'react';
import { OptionSelect, CheckedOption } from '@ukhomeoffice/react-components';
import classnames from 'classnames';
import map from 'lodash/map';
import some from 'lodash/some';
import { connect } from 'react-redux';
import { ApplyChanges, Snippet } from '../';
import { changeFilters } from './actions';

class Filters extends Component {

  componentDidMount() {
    const { active } = this.props;

    this.setState({
      active,
      visible: some(active, 'length')
    }, () => {
      this.scrollToCheckedElements();
    });
  }

  scrollToCheckedElements() {
    const active = this.state.active || {};
    Object.keys(active).forEach(key => {
      const container = document.getElementById(`${key}-options`);
      const child = document.getElementById(`${key}-${active[key][0]}`);
      if (container && child) {
        const offset = child.parentNode.offsetTop;
        container.scrollTo(0, offset);
      }
    });
  }

  emitChange() {
    const { active } = this.state;
    this.props.onFiltersChange(active);
  }

  clearFilters() {
    this.props.onFiltersChange(null);
    this.setState({ active: {} });
  }

  onCheckboxChange(key, filter, checked) {
    const active = { ...this.state.active };
    if (checked) {
      active[key] = active[key] || [];
      if (!active[key].includes(filter)) {
        active[key].push(filter);
      }
    } else {
      const index = active[key].indexOf(filter);
      active[key].splice(index, 1);
    }
    if (!active[key].length) {
      delete active[key];
    }
    this.setState({ active });
  }

  isChecked(key, filter) {
    const { active } = this.state || this.props;
    return active[key] && active[key].includes(filter);
  }

  toggleVisible(e) {
    e.preventDefault();
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    const { options } = this.props;
    return (
      <section className="filters-component">
        <h3 className={classnames({
          'toggle-filter-link': true,
          'filters-hidden': this.state && !this.state.visible
        })}
        >
          <a href="#" onClick={e => this.toggleVisible(e)}><Snippet>filters.filterBy</Snippet></a>
        </h3>
        <section className={classnames({
          hidden: this.state && !this.state.visible
        })}>
          <ApplyChanges
            type="form"
            onApply={() => this.emitChange()}
          >
            <div className="filters govuk-grid-row">
              {
                map(options, ({ values, format }, key) =>
                  <div key={key} className="govuk-grid-column-one-third">
                    <OptionSelect
                      title={<Snippet>{`fields.${key}.label`}</Snippet>}
                      id={key}>
                      {
                        values.map((filter, index) =>
                          <CheckedOption
                            key={index}
                            name={`filter-${key}`}
                            id={`${key}-${filter}`}
                            value={filter}
                            onChange={e => this.onCheckboxChange(key, filter, e.target.checked)}
                            checked={!!this.isChecked(key, filter)}
                          >
                            { format ? format(filter) : filter }
                          </CheckedOption>
                        )
                      }
                    </OptionSelect>
                  </div>
                )
              }
            </div>
            <p className="control-bar">
              <button type="submit" className="govuk-button"><Snippet>filters.applyLabel</Snippet></button>
              <ApplyChanges
                query={{
                  filters: {}
                }}
                onApply={() => this.clearFilters()}
                label={<Snippet>filters.clearLabel</Snippet>} />
            </p>
          </ApplyChanges>
        </section>

      </section>
    );
  }
}

const mapStateToProps = ({ datatable: { filters: { options, active } } }, { formatters }) => {
  return {
    active,
    options: options.reduce((obj, { key, values }) => {
      return {
        ...obj,
        [key]: {
          values,
          format: formatters[key] && formatters[key].format
        }
      };
    }, {})
  };
};

const mapDispatchToProps = dispatch => ({
  onFiltersChange: filters => dispatch(changeFilters(filters))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
