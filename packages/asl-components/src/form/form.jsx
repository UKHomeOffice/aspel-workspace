import React, { Fragment, useState } from 'react';
import { Snippet, Fieldset, Link } from '../';
import classnames from 'classnames';

const Form = ({
    csrfToken,
    className,
    submit = true,
    children,
    detachFields,
    schema,
    cancelLink,
    declaration,
    disabled = false,
    onSubmit = () => {},
    formProps = {},
    ...props
}) => {

    const [isDisabled, setIsDisabled] = useState(disabled);
    const onFormSubmit = e => {
        if (isDisabled) {
            e.preventDefault();
        }
        e.persist();
        onSubmit(e);
        setTimeout(() => setIsDisabled(true), 0);
    };

    const formFields = (
        <Fragment>
            <Fieldset schema={schema} { ...props } />
            { declaration }
            {
                (submit || cancelLink) && (
                    <div className="control-panel">
                        {
                            submit && <button type="submit" className={classnames('govuk-button', submit.className)} disabled={isDisabled}><Snippet>buttons.submit</Snippet></button>
                        }
                        {
                            cancelLink && (
                                <Fragment>
                                    {
                                        typeof cancelLink === 'string'
                                            ? <Link page={cancelLink} label={<Snippet>buttons.cancel</Snippet>} {...props} />
                                            : cancelLink
                                    }
                                </Fragment>
                            )
                        }
                    </div>
                )
            }
        </Fragment>
    );

    return (
        <form
            method="POST"
            noValidate
            className={className}
            onSubmit={onFormSubmit}
            encType={Object.values(schema).map(s => s.inputType).includes('inputFile') ? 'multipart/form-data' : null}
            {...formProps}
        >
            <input type="hidden" name="_csrf" value={csrfToken} />
            {
                detachFields
                    ? React.Children.map(children, child =>
                        React.cloneElement(child, { formFields })
                    )
                    : children
            }
            {
                !detachFields && formFields
            }
        </form>
    );
};

export default Form;
