import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doSearch } from './actions';
import { ApplyChanges } from '../';

export class Search extends Component {

  componentDidMount() {
    this.setState({ value: this.props.filter });
  }

  emitChange() {
    this.props.onChange(this.state.value);
  }

  render() {
    const name = this.props.name;

    return (
      <ApplyChanges type="form" onApply={() => this.emitChange()}>
        <div className="govuk-form-group search-box">
          { this.props.label &&
            <label className="govuk-label" htmlFor={name}>{this.props.label}</label>
          }
          { this.props.hint && <span className="govuk-hint">{this.props.hint}</span> }
          <input
            className="govuk-input"
            id={name}
            name={name}
            type="text"
            value={ this.state ? this.state.value : this.props.filter }
            onChange={e => this.setState({ value: e.target.value })}
          />
          <button type="submit" className="govuk-button"></button>
        </div>
      </ApplyChanges>
    );
  }
}

Search.defaultProps = {
  name: 'filter'
};

const mapStateToProps = ({ datatable: { filters } }) => ({
  filter: filters.active['*'] ? filters.active['*'][0] : ''
});

export default connect(
  mapStateToProps,
  { onChange: value => doSearch(value) }
)(Search);
