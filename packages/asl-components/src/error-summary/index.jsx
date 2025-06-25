import React from 'react';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { getLabelFromRenderers } from '../utils';

const ErrorSummary = ({
    errors,
    formatters = {},
    renderers
}) => {
    if (!size(errors)) {
        return null;
    }
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
                            return <li key={key}>
                                <a href={`#${key}`}>
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

const mapStateToProps = ({ static: { errors } }) => ({ errors });

export default connect(mapStateToProps)(ErrorSummary);
