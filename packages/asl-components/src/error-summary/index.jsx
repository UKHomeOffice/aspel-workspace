import React from 'react';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { getLabelFromRenderers } from '../utils';
import { splitDateValue, getInvalidDateParts } from '../date-input/invalid-parts';
import DateErrorMessage from '../date-input/error-message';

// date fields render as a fieldset (Day / Month / Year) with no id matching the
// field name, so an error summary link of `#${name}` lands on nothing. Collect
// the names of all date fields - including those nested inside reveals - so the
// link can instead target the first input (`#${name}-day`).
function getDateFieldNames(schema = {}, names = new Set()) {
    Object.keys(schema).forEach(key => {
        const field = schema[key];
        if (!field || typeof field !== 'object') {
            return;
        }
        if (field.inputType === 'inputDate') {
            names.add(key);
        }
        (field.options || []).forEach(option => {
            if (option && typeof option === 'object' && option.reveal) {
                getDateFieldNames(option.reveal, names);
            }
        });
    });
    return names;
}

// For a date error, link to the first individually-invalid part (e.g. just the
// month), falling back to the day when no single part can be blamed. Uses the
// same helper as the DateInput so the link and the red highlight always agree.
function getDateHref(name, model) {
    const invalid = getInvalidDateParts(splitDateValue(model?.[name]));
    return `#${name}-${invalid[0] || 'day'}`;
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
    const dateFields = getDateFieldNames(schema);
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
                            const href = dateFields.has(key) ? getDateHref(key, model) : `#${key}`;
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
