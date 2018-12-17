import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doSearch } from './actions';

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
      <div className="govuk-form-group search-box">
        { !this.props.hideLabel &&
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
    );
  }
}

Search.defaultProps = {
  name: 'filter',
  hideLabel: false,
  label: 'Search'
};

const mapStateToProps = ({ datatable: { filters } }) => ({
  filter: filters['*'] ? filters['*'][0] : ''
});

export default connect(
  mapStateToProps,
  { onChange: value => doSearch(value) }
)(Search);
