import React, { Component, Fragment } from 'react';
import { Form, Markdown } from '../';

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
                  conditions && <Markdown>{ conditions }</Markdown>
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
