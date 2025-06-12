/* eslint-disable react/display-name */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

// Custom renderers
function RenderLink({ href, children }) {
    return <a href={href}>{children}</a>;
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
    ...props
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
            {...props}
        >
            {source || children}
        </ReactMarkdown>
    );
}
