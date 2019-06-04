import React, { Component, Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { Form } from '../';
import { Warning } from '@ukhomeoffice/react-components';

class Conditions extends Component {

  componentDidMount() {
    this.setState({ editing: false });
  }

  toggleEdit = e => {
    e.preventDefault();
    this.setState({ editing: !this.state.editing });
  }

  render() {
    const { editing } = this.state || {};
    const {
      conditions,
      label,
      noConditionsLabel,
      canUpdate,
      addLabel = 'Add conditions',
      updateLabel = 'Update conditions',
      children
    } = this.props;

    return (
      <Fragment>
        <p>{ conditions ? label : noConditionsLabel }</p>
        {
          editing && canUpdate
            ? <Form />
            : (
              <Fragment>
                {
                  conditions && <ReactMarkdown>{ conditions }</ReactMarkdown>
                }
                {
                  canUpdate && <a href="#" onClick={this.toggleEdit}>{conditions ? updateLabel : addLabel }</a>
                }
              </Fragment>
            )
        }
        {
          children
        }
      </Fragment>
    );
  }
}

export default Conditions;
