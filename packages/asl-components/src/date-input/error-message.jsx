import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { resolveDateError } from './resolve-error';

// Renders the GOV.UK Design System error message for a date field, but only for fields that have opted in by setting a `dateLabel` in content
export const DateErrorMessage = ({ content, name, value, errorCode, validate, snippetProps = {} }) => {
    const resolved = resolveDateError({ value, errorCode, validate });
    const dateLabel = get(content, `fields.${name}.dateLabel`);

    if (resolved && typeof dateLabel === 'string') {
        return (
            <Snippet
                {...snippetProps}
                dateLabel={dateLabel}
                {...resolved.context}
                fallback={[`errors.default.date.${resolved.key}`]}
            >
                {`errors.${name}.date.${resolved.key}`}
            </Snippet>
        );
    }

    return (
        <Snippet {...snippetProps} fallback={`errors.default.${errorCode}`}>
            {`errors.${name}.${errorCode}`}
        </Snippet>
    );
};

const mapStateToProps = ({ static: { content } = {} }) => ({ content });

export default connect(mapStateToProps)(DateErrorMessage);
