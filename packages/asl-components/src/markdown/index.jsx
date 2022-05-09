import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';

function RenderLink({ href, children }) {
  return <Fragment>[{ children }]({ href })</Fragment>;
}
function RenderLinkReference({ children }) {
  return <Fragment>[{ children }]</Fragment>;
}

const renderers = {
  link: RenderLink,
  linkReference: RenderLinkReference
};

const trim = str => {
  if (typeof str === 'string') {
    return str.split('\n').map(s => s.trim()).join('\n').trim();
  }
  return str;
}

const wrapInSpanIfOnlyChild = enabled => ({ node, siblingCount, index, ...props }) => {
  if (enabled && siblingCount === 1) {
    return <span {...props} />;
  }
  return <p {...props} />;
};

export default function Markdown({ children, links = false, unwrapSingleLine = false, source, ...props }) {

  return <ReactMarkdown
    includeElementIndex={true}
    renderers={!links && renderers}
    components={{ p: wrapInSpanIfOnlyChild(unwrapSingleLine) }}
    {...props}
  >
    { trim(source || children) }
  </ReactMarkdown>;
}
