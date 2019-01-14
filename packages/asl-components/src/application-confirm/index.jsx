import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CheckboxGroup } from '@ukhomeoffice/react-components';
import { Snippet } from '../';

class ApplicationConfirm extends Component {
  componentDidMount() {
    this.setState({
      submitDisabled: true,
      values: []
    });
  }

  onChange(event) {
    const checked = event.target.checked;
    const value = event.target.value;

    this.setState(state => {
      const values = state.values;

      if (checked) {
        values.push(value);
      } else {
        values.splice(values.indexOf(value), 1);
      }

      return {
        values,
        submitDisabled: this.props.declarations.length !== values.length
      };
    });
  }

  render() {
    return (
      <div className="application-confirm">
        <CheckboxGroup
          name="declarations"
          label={<Snippet>declarations.title</Snippet>}
          options={this.props.declarations}
          error={this.props.error}
          onChange={this.onChange.bind(this)}
          value={this.state ? this.state.values : []}
        />
        <button type="submit" className="govuk-button" disabled={!this.state || this.state.submitDisabled}>
          <Snippet>buttons.submit</Snippet>
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ static: { declarations, error } }) => ({ declarations, error });

export default connect(mapStateToProps)(ApplicationConfirm);
