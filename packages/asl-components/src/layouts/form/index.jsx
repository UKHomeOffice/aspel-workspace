import React from 'react';
import classnames from 'classnames';
import { ErrorSummary, OpenTaskWarning, Form, Sidebar } from '../../';

const FormLayout = ({
    children,
    className,
    openTasks,
    sidebar,
    fullWidth = false,
    ...props
}) => (
    <div className={classnames('govuk-grid-row', className)}>
        <div className={fullWidth ? 'govuk-grid-column-full' : 'govuk-grid-column-two-thirds'}>
            <OpenTaskWarning openTasks={openTasks} />
            <ErrorSummary formatters={props.formatters} />
            {
                children
            }
            <Form {...props} />
        </div>
        {
            sidebar && <Sidebar>{ sidebar }</Sidebar>
        }
    </div>
);

export default FormLayout;
