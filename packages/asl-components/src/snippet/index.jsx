import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import Markdown from '../markdown';
import { render } from 'mustache';

function getKeysToTry(primary, fallback) {
    if (Array.isArray(fallback)) {
        return [primary, ...fallback];
    }

    if(['string', 'number'].includes(typeof fallback)) {
        return [primary, fallback];
    }

    return [primary];
}

function getTemplate(content, primary, fallback) {
    const keysToTry = getKeysToTry(primary, fallback);

    for (let key of keysToTry) {
        const template = get(content, key);
        if (typeof template === 'string') {
            return template;
        }
    }

    return undefined;
}

export const Snippet = ({ content, children, optional, fallback, ...props }) => {
    // dynamic children with {value} values get passes as an array
    const primary = Array.isArray(children) ? children.join('') : children;


    const str = getTemplate(content, primary, fallback);

    if (str === undefined && optional) {
        return null;
    }

    if (str === undefined) {
        throw new Error(`Failed to lookup content snippet. Tried keys: ${JSON.stringify(getKeysToTry(primary, fallback))}`);
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
