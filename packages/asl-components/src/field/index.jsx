import React, { Component } from 'react';
import isUndefined from 'lodash/isUndefined';
import { TextArea } from '@ukhomeoffice/react-components';
import ReactMarkdown from 'react-markdown';

class Field extends Component {
  constructor (props) {
    super(props);
    this.state = {
      editing: false,
      content: this.props.content
    }
    this.toggleEditing = this.toggleEditing.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  toggleEditing(e) {
    e.preventDefault();
    this.setState({
      editing: !this.state.editing
    });
  }

  onChange(e) {
    this.setState({ content: e.target.value })
  }

  render () {
    const { title, content, name } = this.props;
    return (
      <div className="field">
        <h2>{ title }</h2>
        {
          this.props.editable && (!this.state || this.state.editing)
            ? <TextArea
              label=""
              name={name}
              value={this.state ? this.state.content : content}
              onChange={this.onChange}
            />
            : <ReactMarkdown>{ content }</ReactMarkdown>
        }
        {
          this.props.editable && this.state && <a href="#" onClick={this.toggleEditing}>{this.state.editing ? 'Cancel' : 'Edit'}</a>
        }
      </div>
    )
  }
}

export default Field;
