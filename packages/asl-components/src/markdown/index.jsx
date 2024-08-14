/* eslint-disable react/display-name */
import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

function RenderLink({ href, children }) {
    return <Fragment>[{ children }]({ href })</Fragment>;
}
function RenderLinkReference({ children }) {
    return <Fragment>[{ children }]</Fragment>;
}

const components = {
    link: RenderLink,
    linkReference: RenderLinkReference
};

// eslint-disable-next-line no-unused-vars
const wrapInSpanIfOnlyChild = (enabled, paragraphProps) => ({ node, siblingCount, index, ...props }) => {
    if (enabled && siblingCount === 1) {
        return <span {...props} />;
    }

    return <p {...paragraphProps} {...props} />;
};

export default function Markdown({
    children,
    links = false,
    unwrapSingleLine = false,
    significantLineBreaks = false,
    paragraphProps = {},
    source,
    ...props
}) {
    return <ReactMarkdown
        includeElementIndex={true}
        components={{
            ...(!links && components),
            p: wrapInSpanIfOnlyChild(unwrapSingleLine, paragraphProps)
        }}
        remarkPlugins={significantLineBreaks ? [remarkBreaks] : []}
        {...props}
    >
        { source || children }
    </ReactMarkdown>;
}
