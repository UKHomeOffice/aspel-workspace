import React, { Component, Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { Form } from '../';

class Conditions extends Component {

  componentDidMount() {
    this.setState({ editing: false });
  }

  toggleEdit (e) {
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
                  canUpdate && <a href="#" onClick={e => this.toggleEdit(e)}>{conditions ? updateLabel : addLabel }</a>
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
