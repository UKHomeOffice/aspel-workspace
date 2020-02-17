import React from 'react';
import ReactMarkdown from 'react-markdown';

function RenderLink({ href, children }) {
  return <span>[{ children }]({ href })</span>;
}

export default function Markdown({ children, links = false, ...props }) {
  return <ReactMarkdown renderers={!links && { link: RenderLink }} {...props}>{ children }</ReactMarkdown>;
}
