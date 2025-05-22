import React from 'react';
import { CheckboxGroup } from '@ukhomeoffice/react-components';
import { applyFormatters } from '../utils';

export default function ApplicationConfirm(props) {
    const {
        error,
        title = 'Please confirm that you understand',
        hint,
        label,
        name = 'declaration'
    } = applyFormatters(props);

    return (
        <div className="application-confirm">
            <CheckboxGroup
                name={name}
                label={title}
                hint={hint}
                hintWrapper={
                    hint
                        ? ({ id, children }) => <div id={id}>{children}</div>
                        : undefined
                }
                options={[{ label, value: true }]}
                error={error}
            />
        </div>
    );
}
