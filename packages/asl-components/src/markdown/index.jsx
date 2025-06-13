/* eslint-disable react/display-name */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import ErrorBoundary from '@asl/projects/client/components/error-boundary';

// Checks if children include any block-level elements (like <p>, <h1>, etc.)
function containsBlock(children) {
    return React.Children.toArray(children).some(child => {
        if (typeof child === 'object' && child !== null && 'type' in child) {
            const blockTags = ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'div', 'section', 'article'];
            return blockTags.includes(child.type);
        }
        return false;
    });
}

function RenderLink({ href, children }) {
    if (containsBlock(children)) {
    // Don't render anchor tag if it would wrap block-level content
        return <>{children}</>;
    }
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
    linkTarget, // filtered out to avoid DOM warning
    ...rest
}) {
    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
}
