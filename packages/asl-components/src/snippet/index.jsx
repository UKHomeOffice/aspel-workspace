import React, { Fragment } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { render } from 'mustache';

const trim = value => value.split('\n').map(s => s.trim()).join('\n').trim();

export const Snippet = ({ content, children, optional, fallback, ...props }) => {
  const str = get(content, children);
  if (str === undefined && optional) {
    return null;
  }
  if (str === undefined) {
    throw new Error(`Failed to lookup content snippet: ${children}`);
  }
  const source = trim(render(str, props));

  const isRootParagraph = (node, i, parent) => {
    return node.type !== 'paragraph' || parent.type !== 'root' || parent.children.length !== 1;
  };

  return (
    <ReactMarkdown
      source={source}
      renderers={{ root: Fragment }}
      allowNode={isRootParagraph}
      unwrapDisallowed={true}
    />
  );
};

const mapStateToProps = ({ static: { content, establishment }, model }) => ({ content, establishment, model });

export default connect(mapStateToProps)(Snippet);
