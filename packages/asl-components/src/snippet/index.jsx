import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { render } from 'mustache';

const trim = value => value.split('\n').map(s => s.trim()).join('\n').trim();

export const Snippet = ({ content, children, optional, fallback, ...props }) => {
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

  function wrapInSpanIfOnlyChild({ node, siblingCount, index, ...props }) {
    if (siblingCount === 1) {
      return <span {...props} />;
    }
    return <p {...props} />;
  }

  return (
    <ReactMarkdown
      includeElementIndex={true}
      components={{ p: wrapInSpanIfOnlyChild }}
    >{ source }</ReactMarkdown>
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
