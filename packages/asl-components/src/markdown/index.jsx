/* eslint-disable react/display-name */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkFlexibleMarkers from 'remark-flexible-markers';
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

function RenderLinkReference({ children }) {
    return <>{children}</>;
}

function RenderUnorderedList({ children }) {
    return <ul className="govuk-list govuk-list--bullet">{children}</ul>;
}

const ParagraphComponent = ({ unwrapSingleLine, paragraphProps, children, ...props }) => {
    const isSingleTextChild = (
        React.Children.count(children) === 1 &&
    typeof children[0] === 'string'
    );

    const hasVisibleLineBreaks = (
        isSingleTextChild &&
    children[0].includes('\n')
    );

    if (unwrapSingleLine && isSingleTextChild && !hasVisibleLineBreaks) {
        return <span {...paragraphProps} {...props}>{children}</span>;
    }

    return <p {...paragraphProps} {...props}>{children}</p>;
};

export default function Markdown({
    children,
    links = false,
    unwrapSingleLine = false,
    significantLineBreaks = false,
    paragraphProps = {},
    source,
    linkTarget = '_blank',
    ...rest
}) {
    return (
        <ErrorBoundary>
            <ReactMarkdown
                components={{
                    ...(!links && {
                        a: RenderLink,
                        linkReference: RenderLinkReference,
                        ul: RenderUnorderedList
                    }),
                    p: (props) => (
                        <ParagraphComponent
                            unwrapSingleLine={unwrapSingleLine}
                            paragraphProps={paragraphProps}
                            {...props}
                        />
                    ),
                    mark: ({ ...props }) => <mark {...props} />
                }}
                remarkPlugins={significantLineBreaks ? [remarkBreaks, remarkFlexibleMarkers] : [remarkFlexibleMarkers]}
                {...rest}
            >
                {source || children}
            </ReactMarkdown>
        </ErrorBoundary>
    );
}
