import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import Markdown from '../markdown';
import { render } from 'mustache';

function getTemplate(content, primary, fallback) {
    const keysToTry = [primary, ...(Array.isArray(fallback) ? fallback : [fallback])];

    for (let key of keysToTry) {
        const template = get(content, key);
        if (template != undefined) {
            return template;
        }
    }

    return undefined;
}

export const Snippet = ({ content, children, optional, fallback, ...props }) => {
    const str = getTemplate(content, children, fallback);
    if (str === undefined && optional) {
        return null;

    }
    if (str === undefined) {
        throw new Error(`Failed to lookup content snippet: ${children}`);
    }
    if (typeof str !== 'string') {
        throw new Error(`Invalid content snippet for key ${children}: ${JSON.stringify(str)}`);
    }
    const source = render(str, props);

    return (
        <Markdown
            unwrapSingleLine={true}
            linkTarget={props.linkTarget}
        >{ source }</Markdown>
    );
};

const mapStateToProps = ({
    static: staticProps,
    model
}) => ({
    ...staticProps,
    model
});

export default connect(mapStateToProps)(Snippet);
