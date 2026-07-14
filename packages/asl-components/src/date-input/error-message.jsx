import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { splitDateValue, getInvalidDateParts } from './invalid-parts';

// Error text for a date field. When exactly one part (day/month/year) is
// individually invalid AND the field label is a plain string, we render a
// part-specific message via the generic `errors.default.validDatePart` template
// (e.g. "Date awarded must be a valid month"). In every other case - multiple
// bad parts, an ambiguous whole-date error, or a non-string label - we render
// the field's normal error snippet unchanged, so bespoke per-field wording is
// preserved. Uses the same getInvalidDateParts helper as the input highlight
// and the error-summary link, so all three stay in agreement.
export const DateErrorMessage = ({ content, name, value, errorCode, snippetProps = {} }) => {
    const invalid = getInvalidDateParts(splitDateValue(value));
    const fieldLabel = get(content, `fields.${name}.label`);

    if (invalid.length === 1 && typeof fieldLabel === 'string') {
        return (
            <Snippet
                {...snippetProps}
                fieldLabel={fieldLabel}
                datePart={invalid[0]}
                fallback={['errors.default.validDatePart']}
            >
                {`errors.${name}.validDatePart`}
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
