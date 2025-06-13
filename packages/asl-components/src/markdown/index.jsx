/* eslint-disable react/display-name */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

// Custom link renderer with optional support for target=_blank
function RenderLink({ href, children }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
}

function RenderUnorderedList({ children }) {
    return <ul className="govuk-list govuk-list--bullet">{children}</ul>;
}

export default function Markdown({
    children,
    links = false,
    significantLineBreaks = false,
    paragraphProps = {},
    source,
    linkTarget, // Filter out unsupported props to avoid hydration crash
    ...rest
}) {
    return (
        <ReactMarkdown
            components={{
                ...(links ? {} : {
                    a: RenderLink,
                    ul: RenderUnorderedList
                }),
                p: ({ children }) => <p {...paragraphProps}>{children}</p>
            }}
            remarkPlugins={significantLineBreaks ? [remarkBreaks] : []}
            {...rest}
        >
            {source || children}
        </ReactMarkdown>
    );
}
