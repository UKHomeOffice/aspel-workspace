import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { resolveDateError } from './resolve-error';

// Renders the GOV.UK Design System error message for a date field. resolveDateError
// works out which GDS state applies (enter / incomplete / real date / past / future
// / ...); we render it from `errors.<field>.date.<key>`, falling back to the generic
// `errors.default.date.<key>` template. The message noun-phrase comes from the
// field's `dateLabel` (e.g. "Award date"), falling back to its label. When we can't
// map the code, or have no string label, we fall back to the field's plain error.
export const DateErrorMessage = ({ content, name, value, errorCode, validate, snippetProps = {} }) => {
    const resolved = resolveDateError({ value, errorCode, validate });
    const dateLabel = get(content, `fields.${name}.dateLabel`) ?? get(content, `fields.${name}.label`);

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
