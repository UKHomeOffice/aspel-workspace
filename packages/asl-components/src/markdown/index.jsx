/* eslint-disable react/display-name */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import ErrorBoundary from '@asl/projects/client/components/error-boundary';

// Checks if children include any block-level elements (like <p>, <h1>, etc.)
function containsBlock(children) {
    return React.Children.toArray(children).some(child => {
        if (typeof child === 'object' && child !== null && 'type' in child) {
            const blockTags = ['span','p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'div', 'section', 'article'];
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
    unwrapSingleLine = false,
    significantLineBreaks = false,
    paragraphProps = {},
    source,
    linkTarget,
    ...rest
}) {
    const Paragraph = ({ children, ...props }) => {
    // Reimplement conditional wrapping
        if (unwrapSingleLine && React.Children.count(children) === 1) {
            return <span {...paragraphProps} {...props}>{children}</span>;
        }
        return <p {...paragraphProps} {...props}>{children}</p>;
    };

    return (
        <ErrorBoundary>
            <ReactMarkdown
                components={{
                    ...(links ? {} : {
                        a: RenderLink,
                        ul: RenderUnorderedList
                    }),
                    p: Paragraph // Use our custom component
                }}
                remarkPlugins={significantLineBreaks ? [remarkBreaks] : []}
                {...rest}
            >
                {source || children}
            </ReactMarkdown>
        </ErrorBoundary>
    );
}
