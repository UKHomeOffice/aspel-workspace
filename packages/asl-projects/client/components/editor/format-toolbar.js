import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdCode,
  MdLooksOne,
  MdLooksTwo,
  MdFormatQuote,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdImage,
  MdFormatClear
} from 'react-icons/md';
import { FaSuperscript, FaSubscript, FaIndent, FaOutdent, FaTable } from 'react-icons/fa';

class FormatToolbar extends Component {

  hasMark = type => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type === type);
  }

  renderBlockButton = (type, IconComponent, tooltip) => {
    const isActive = this.props.query('hasBlock', type);

    if (type === 'input-file') {
      return (
        <button
          className={classnames('tooltip-icon-button', { active: isActive })}
          title={tooltip}
          aria-label={tooltip}
          tabIndex={-1}
        >
          <input
            type='file'
            onChange={this.onClickImage}
            aria-label={tooltip}
          />
          <IconComponent size={24} />
        </button>
      );
    }

    return (
      <button
        onClick={event => this.onClickBlock(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
        title={tooltip}
        aria-label={tooltip}
      >
        <IconComponent size={24} />
      </button>
    );
  }

  renderMarkButton = (type, IconComponent, tooltip) => {
    const isActive = this.hasMark(type);
    return (
      <button
        onClick={event => this.onClickMark(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
        title={tooltip}
        aria-label={tooltip}
      >
        <IconComponent size={24} />
      </button>
    );
  }

  onClickMark = (event, type) => {
    event.preventDefault();
    this.props.command('toggleMark', type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    this.props.command('toggleBlock', type);
  }

  onClickImage = event => {
    event.preventDefault();
    this.props.command('onClickImage', event);
  }

  command = (action, ...args) => event => {
    event.preventDefault();
    this.props.command(action, ...args);
  }

  renderTableToolbar() {
    return this.props.inTable
      ? (
        <div className="table-controls">
          <button onClick={this.command('insertColumn')}>Insert Column</button>
          <button onClick={this.command('insertRow')}>Insert Row</button>
          <button onClick={this.command('removeColumn')}>Remove Column</button>
          <button onClick={this.command('removeRow')}>Remove Row</button>
          <button onClick={this.command('removeTable')}>Remove Table</button>
        </div>
      )
      : (
        <button
          className="tooltip-icon-button"
          onClick={this.command('insertTable')}
          title="Insert table"
          aria-label="Insert table"
        >
          <FaTable  size={24} />
        </button>
      );
  }

  renderListToolbar() {
    const inList = this.props.query('isSelectionInList');
    const inNumbered = this.props.query('isSelectionInList', 'numbered-list');
    const inBulleted = this.props.query('isSelectionInList', 'bulleted-list');

    const toggleBulletedLabel = inBulleted ? 'Remove bulleted list' : 'Bulleted list';
    const toggleNumberedLabel = inNumbered ? 'Remove numbered list' : 'Numbered list';

    return (
      <Fragment>
        <button
          className={classnames('tooltip-icon-button', { active: inBulleted })}
          onMouseDown={this.command(inBulleted ? 'unwrapList' : 'wrapInList', 'bulleted-list')}
          title={toggleBulletedLabel}
          aria-label={toggleBulletedLabel}
        >
          <MdFormatListBulleted size={24} />
        </button>
        <button
          className={classnames('tooltip-icon-button', { active: inNumbered })}
          onMouseDown={this.command(inNumbered ? 'unwrapList' : 'wrapInList', 'numbered-list')}
          title={toggleNumberedLabel}
          aria-label={toggleNumberedLabel}
        >
          <MdFormatListNumbered size={24} />
        </button>
        <button
          className="tooltip-icon-button"
          disabled={!inList}
          onMouseDown={this.command('decreaseItemDepth')}
          title="Decrease list indent"
          aria-label="Decrease list indent"
        >
          <FaOutdent size={24} />
        </button>
        <button
          className="tooltip-icon-button"
          disabled={!inList}
          onMouseDown={this.command('increaseItemDepth')}
          title="Increase list indent"
          aria-label="Increase list indent"
        >
          <FaIndent size={24} />
        </button>
      </Fragment>
    );
  }

  clearFormatting = e => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to clear formatting in selection?')) {
      this.props.command('unwrapBlocks');
      this.props.command('clearMarks');
    }
  }

  renderClearFormattingButton() {
    return (
      <button
        className="tooltip-icon-button"
        onMouseDown={this.clearFormatting}
        title="Clear formatting"
        aria-label="Clear formatting"
      >
        <MdFormatClear size={24} />
      </button>
    );
  }

  render () {
    return (
      <div className="format-toolbar">
        {this.renderMarkButton('bold', MdFormatBold, 'Bold')}
        {this.renderMarkButton('italic', MdFormatItalic, 'Italic')}
        {this.renderMarkButton('underlined', MdFormatUnderlined, 'Underlined')}
        {this.renderMarkButton('code', MdCode, 'Code')}
        {this.renderBlockButton('heading-one', MdLooksOne, 'Heading 1')}
        {this.renderBlockButton('heading-two', MdLooksTwo, 'Heading 2')}
        {this.renderBlockButton('block-quote', MdFormatQuote, 'Block quote')}
        {this.renderBlockButton('input-file', MdImage, 'Insert image')}
        {this.renderMarkButton('superscript', FaSuperscript, 'Superscript')}
        {this.renderMarkButton('subscript', FaSubscript, 'Subscript')}
        {this.renderListToolbar()}
        {this.renderClearFormattingButton()}
        {this.renderTableToolbar()}
      </div>
    );
  }
}

export default FormatToolbar;
