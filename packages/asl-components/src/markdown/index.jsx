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

export default function Markdown({ children, links = false, ...props }) {
  return <ReactMarkdown renderers={!links && renderers} {...props}>{ children }</ReactMarkdown>;
}
