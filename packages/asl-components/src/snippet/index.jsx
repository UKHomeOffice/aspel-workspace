import React, { Fragment } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown/with-html';
import { render } from 'mustache';

const trim = value => value.split('\n').map(s => s.trim()).join('\n').trim();

export const Snippet = ({ content, children, optional, fallback, escapeHtml = true, ...props }) => {
  const str = get(content, children, get(content, fallback));
  if (str === undefined && optional) {
    return null;
  }
  if (str === undefined) {
    throw new Error(`Failed to lookup content snippet: ${children}`);
  }
  if (typeof str !== 'string') {
    throw new Error(`Invalid content snippet for key ${children}: ${JSON.stringify(str)}`);
  }
  const source = trim(render(str, props));

  function wrapInSpanIfOnlyChild({ children, parentChildCount }) {
    return parentChildCount > 1
      ? <p>{ children }</p>
      : <span>{ children }</span>;
  }

  return (
    <ReactMarkdown
      source={source}
      includeNodeIndex={true}
      renderers={{ root: Fragment, paragraph: wrapInSpanIfOnlyChild }}
      escapeHtml={escapeHtml}
    />
  );
};

const mapStateToProps = ({
  static: staticProps,
  model
}) => ({
  ...staticProps,
  model
});

export default connect(mapStateToProps)(Snippet);
