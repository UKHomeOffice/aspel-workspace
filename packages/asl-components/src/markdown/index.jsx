import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkFlexibleMarkers from 'remark-flexible-markers';

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

function RenderLink({ href, children, linkTarget }) {
    if (containsBlock(children)) {
        return <>{children}</>;
    }

    const linkProps = linkTarget ? { target: linkTarget, rel: 'noopener noreferrer' } : {};

    return (
        <a href={href} {...linkProps} >
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

const ParagraphComponent = ({
    unwrapSingleLine,
    paragraphProps,
    contentLength,
    children,
    node,
    significantLineBreaks,
    ...props
}) => {
    const { start, end } = node.position;
    const isOnlyNode = contentLength && start.offset === 0 && end.offset === contentLength;
    const childrenArray = React.Children.toArray(children);
    const isSingleTextChild = childrenArray.length === 1 && typeof childrenArray[0] === 'string';
    const hasVisibleLineBreaks = significantLineBreaks && childrenArray[0].includes('\n');

    if (unwrapSingleLine && isOnlyNode && isSingleTextChild && !hasVisibleLineBreaks) {
        return <span {...paragraphProps} {...props}>{children}</span>;
    }

    // Ensure we don't nest paragraphs
    const containsParagraph = childrenArray.some(child =>
        React.isValidElement(child) && child.type === 'p'
    );

    if (containsParagraph) {
        return <div {...paragraphProps} {...props}>{children}</div>;
    }

    // inline markdown for in-complete training page
    if (unwrapSingleLine) {
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
    // eslint-disable-next-line no-unused-vars
    linkTarget,
    ...rest
}) {
    const contents = source || children;
    const contentLength = contents?.length ? contents.length : 0;

    return (
        <ReactMarkdown
            components={{
                ...(!links && {
                    a: props => <RenderLink linkTarget={linkTarget} {...props} />,
                    linkReference: RenderLinkReference,
                    ul: RenderUnorderedList
                }),
                p: (props) => (
                    <ParagraphComponent
                        unwrapSingleLine={unwrapSingleLine}
                        significantLineBreaks={significantLineBreaks}
                        contentLength={contentLength}
                        paragraphProps={paragraphProps}
                        {...props}
                    />
                ),
                mark: (props) => <mark {...props} />
            }}
            remarkPlugins={[
                ...(significantLineBreaks ? [remarkBreaks] : []),
                remarkFlexibleMarkers
            ]}
            //unwrapDisallowed={true}  // Prevents invalid HTML nesting
            {...rest}
        >
            {contents}
        </ReactMarkdown>
    );
}
