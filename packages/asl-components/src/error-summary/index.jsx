import React from 'react';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { getLabelFromRenderers } from '../utils';

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

const ErrorSummary = ({
    errors,
    schema = {},
    formatters = {},
    renderers
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
                            const href = dateFields.has(key) ? `#${key}-day` : `#${key}`;
                            return <li key={key}>
                                <a href={href}>
                                    {
                                        renderers && getLabelFromRenderers(renderers, key, 'error')?.error
                                            ?
                                            <Error name={key} renderers={renderers} />
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

const mapStateToProps = ({ static: { errors, schema } }) => ({ errors, schema });

export default connect(mapStateToProps)(ErrorSummary);
