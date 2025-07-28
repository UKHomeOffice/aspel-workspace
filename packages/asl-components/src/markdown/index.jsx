import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkFlexibleMarkers from 'remark-flexible-markers';
import ErrorBoundary from '../error-boundary';

// Utility function to check for block-level elements
function containsBlock(children) {
    return React.Children.toArray(children).some(child => {
        if (React.isValidElement(child)) {
            const blockTags = ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'div', 'section', 'article'];
            return blockTags.includes(child.type);
        }
        return false;
    });
}

function RenderLink({ href, children }) {
    if (containsBlock(children)) {
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
    const childrenArray = React.Children.toArray(children);
    const isSingleTextChild = childrenArray.length === 1 && typeof childrenArray[0] === 'string';
    const hasVisibleLineBreaks = isSingleTextChild && childrenArray[0].includes('\n');

    if (unwrapSingleLine && isSingleTextChild && !hasVisibleLineBreaks) {
        return <span {...paragraphProps} {...props}>{children}</span>;
    }

    // Ensure we don't nest paragraphs
    const containsParagraph = childrenArray.some(child =>
        React.isValidElement(child) && child.type === 'p'
    );

    if (containsParagraph) {
        return <div {...paragraphProps} {...props}>{children}</div>;
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
    // eslint-disable-next-line no-unused-vars
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
                remarkPlugins={[
                    ...(significantLineBreaks ? [remarkBreaks] : []),
                    remarkFlexibleMarkers
                ]}
                unwrapDisallowed={true}  // Prevents invalid HTML nesting
                skipHtml={true}         // Avoids potential HTML parsing issues
                {...rest}
            >
                {source || children}
            </ReactMarkdown>
        </ErrorBoundary>
    );
}
