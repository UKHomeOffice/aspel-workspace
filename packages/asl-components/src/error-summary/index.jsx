import React from 'react';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { getLabelFromRenderers } from '../utils';
import { splitDateValue, getInvalidDateParts } from '../date-input/invalid-parts';
import DateErrorMessage from '../date-input/error-message';
import { firstOptionHref } from './first-option-id';

// date fields render as a fieldset (Day / Month / Year)

function getDateFields(schema = {}, fields = new Map()) {
    Object.keys(schema).forEach(key => {
        const field = schema[key];
        if (!field || typeof field !== 'object') {
            return;
        }
        if (field.inputType === 'inputDate') {
            fields.set(key, field);
        }
        (field.options || []).forEach(option => {
            if (option && typeof option === 'object' && option.reveal) {
                getDateFields(option.reveal, fields);
            }
        });
    });
    return fields;
}

// For a date error, link to the first individually-invalid part
function getDateHref(name, model) {
    const invalid = getInvalidDateParts(splitDateValue(model?.[name]));
    return `#${name}-${invalid[0] || 'day'}`;
}

// radio/checkbox groups render as a fieldset whose id matches the field name,
function getChoiceFields(schema = {}, fields = new Map()) {
    Object.keys(schema).forEach(key => {
        const field = schema[key];
        if (!field || typeof field !== 'object') {
            return;
        }
        if (field.inputType === 'radioGroup' || field.inputType === 'checkboxGroup') {
            fields.set(key, field);
        }
        (field.options || []).forEach(option => {
            if (option && typeof option === 'object' && option.reveal) {
                getChoiceFields(option.reveal, fields);
            }
        });
    });
    return fields;
}

const ErrorSummary = ({
    errors,
    schema = {},
    formatters = {},
    renderers,
    model = {}
}) => {
    if (!size(errors)) {
        return null;
    }
    const dateFields = getDateFields(schema);
    const choiceFields = getChoiceFields(schema);
    return (
        <div className="govuk-error-summary" role="alert" aria-labelledby="error-summary-title" tabIndex="-1">
            <h2 className="govuk-error-summary__title" id="error-summary-title">
                <Snippet>
                    {
                        size(errors) > 1
                            ? 'errors.headingPlural'
                            : 'errors.heading'
                    }
                </Snippet>
            </h2>
            <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                    {
                        Object.keys(errors).map(key => {
                            const snippetProps = formatters[key]?.renderContext ?? {};
                            const href = dateFields.has(key)
                                ? getDateHref(key, model)
                                : choiceFields.has(key)
                                    ? firstOptionHref(key, choiceFields.get(key))
                                    : `#${key}`;
                            return <li key={key}>
                                <a href={href}>
                                    {
                                        renderers && getLabelFromRenderers(renderers, key, 'error')?.error
                                            ?
                                            <Error name={key} renderers={renderers} />
                                            : dateFields.has(key)
                                                ?
                                                <DateErrorMessage
                                                    name={key}
                                                    value={model?.[key]}
                                                    errorCode={errors[key]}
                                                    validate={dateFields.get(key)?.validate}
                                                    snippetProps={snippetProps}
                                                />
                                                :
                                                <Snippet fallback={`errors.default.${errors[key]}`} {...snippetProps}>
                                                    {`errors.${key}.${errors[key]}`}
                                                </Snippet>
                                    }
                                </a>
                            </li>;
                        }
                        )
                    }
                </ul>
            </div>
        </div>
    );
};

function Error({ renderers, name }) {
    return getLabelFromRenderers(renderers, name, 'error').error;
}

const mapStateToProps = ({ static: { errors, schema }, model }) => ({ errors, schema, model });

export default connect(mapStateToProps)(ErrorSummary);
