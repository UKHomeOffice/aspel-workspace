import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { splitDateValue, getInvalidDateParts } from './invalid-parts';

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
