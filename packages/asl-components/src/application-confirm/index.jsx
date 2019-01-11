import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CheckboxGroup } from '@ukhomeoffice/react-components';
import { Snippet } from '../';

class ApplicationConfirm extends Component {
  componentDidMount() {
    this.setState({
      declarationCount: this.props.declarations.length,
      checkedCount: 0,
      disabled: true
    });
  }

  onChange(event) {
    console.log(this.state);
    console.log(event.target);

    this.setState(state => {
      const checkedCount = event.target.checked ? state.checkedCount + 1 : state.checkedCount - 1;

      return {
        checkedCount,
        disabled: checkedCount < state.declarationCount
      };
    });

    return true;
  }

  render() {
    return (
      <div className="application-confirm">
        <CheckboxGroup
          name="declarations"
          label={<Snippet>declaration.title</Snippet>}
          options={this.props.declarations}
          error={this.props.error}
          onChange={this.onChange.bind(this)}
        />
        <button type="submit" className="govuk-button" disabled={!this.state || this.state.disabled}>
          <Snippet>buttons.submit</Snippet>
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ static: { declarations, error } }) => ({ declarations, error });

export default connect(mapStateToProps)(ApplicationConfirm);
