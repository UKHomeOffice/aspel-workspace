import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import ReactMarkdown from 'react-markdown';

import get from 'lodash/get';
import defer from 'lodash/defer';
import debounce from 'lodash/debounce';

import FormatToolbar from './format-toolbar';
import initialValue from './initial-value'
import Blocks from './blocks';
import Marks from './marks';
import Image from './image';
import Table from './table';
import List from './list';

const tablePlugin = Table();
const listPlugin = List();

const plugins = [
  Blocks(),
  Marks(),
  Image(),
  tablePlugin,
  listPlugin
];

const serialiseValue = value => {
  const jsonVal = JSON.stringify(value.toJSON());
  if (jsonVal === JSON.stringify(Value.fromJSON(initialValue('')))) {
    return null;
  }
  return jsonVal;
};

const normaliseValue = value => {
  // if value is falsy, init with empty value
  if (!value) {
    return initialValue('');
  }
  try {
    // try and parse value
    value = JSON.parse(value)
  } catch(e) {
    // if value is unable to be JSON parsed, set it as a single text node
    value = initialValue(value);
  }
  // if structure is empty and incomplete, init with empty value
  if (get(value, 'document.nodes.length') === 0) {
    value = initialValue('');
  }
  return value;
}

class TextEditor extends Component {
  constructor(props) {
    super(props);
    const value = normaliseValue(this.props.value);

    this.state = {
      value: Value.fromJSON(value),
      focus: false
    }
  }

  ref = editor => {
    this.editor = editor;
  };

  save = () => {
    const { value } = this.state;
    this.props.onChange(serialiseValue(value));
  }

  onChange = ({ value }) => {
    this.setState({ value }, debounce(this.save, 500, { maxWait: 5000 }));
  };

  onFocus = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: true }));
  };

  onBlur = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: false }));
  };

  command = (func, ...args) => {
    this.editor[func] && this.editor[func](...args);
  }

  query = (func, ...args) => {
    if (!this.editor) {
      return false;
    }
    if (!this.editor[func]) {
      throw new Error(`Query "${func}" is not defined`)
    }
    return this.editor[func](...args)
  }

  render() {
    const { value } = this.state;
    if (this.props.readOnly && !serialiseValue(value)) {
      return <em>No answer provided</em>;
    }
    return (
      <div
        className={classnames(
          'govuk-form-group',
          { 'govuk-form-group--error': this.props.error },
          this.props.className
        )}
      >
        {
          !this.props.readOnly && (
            <Fragment>
              <label className='govuk-label' htmlFor={this.props.name}>
                {this.props.label}
              </label>
              {
                this.props.hint && (
                  <span id={`${this.props.name}-hint`} className='govuk-hint'>
                    <ReactMarkdown source={this.props.hint} />
                  </span>
                )
              }
              {
                this.props.error && (
                  <span id={`${this.props.name}-error`} className='govuk-error-message'>
                    {this.props.error}
                  </span>
                )
              }
            </Fragment>
          )
        }
        <div id={this.props.name} className={classnames('editor', { focus: this.state.focus, readonly: this.props.readOnly })}>
          {
            !this.props.readOnly && (
              <FormatToolbar
                value={this.state.value}
                inTable={tablePlugin.queries.isSelectionInTable(value)}
                query={this.query}
                command={this.command}
              />
            )
          }
          <Editor
            spellCheck
            placeholder=''
            ref={this.ref}
            plugins={plugins}
            value={value}
            onChange={this.onChange}
            name={this.props.name}
            key={this.props.name}
            readOnly={this.props.readOnly}
            decorateNode={this.props.decorateNode}
            renderDecoration={this.props.renderDecoration}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </div>
      </div>
    );
  }
}

export default TextEditor;
