import React, { Component, Fragment } from 'react';
import { TextArea, Button } from '@ukhomeoffice/react-components';

class Editable extends Component {
  state = {
    content: this.props.content
  }

  onChange = e => {
    const content = e.target.value;
    this.setState({ content });
  }

  save = e => {
    e.preventDefault();
    if (!!this.state.content && this.state.content !== '') {
      this.props.onSave(this.state.content)
    } else {
      window.alert('Condition/authorisation cannot be empty');
    }
  }

  cancel = e => {
    e.preventDefault();
    if (this.state.content !== this.props.content) {
      if (window.confirm('Are you sure')) {
        this.props.onCancel();
      }
    } else {
      this.props.onCancel();
    }
  }

  revert = e => {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      this.props.onRevert();
    }
  }

  render () {
    const { edited, updating } = this.props;
    const { content } = this.state;

    return (
      <Fragment>
        <TextArea
          value={content}
          onChange={this.onChange}
        />
        <p className="control-panel">
          <Button disabled={updating} onClick={this.save}>Save</Button>
          <Button disabled={updating} onClick={this.cancel} className="link">Cancel</Button>
          {
            edited && <Button disabled={updating} onClick={this.revert} className="link">Revert to default</Button>
          }
        </p>
      </Fragment>
    )
  }
}

export default Editable
