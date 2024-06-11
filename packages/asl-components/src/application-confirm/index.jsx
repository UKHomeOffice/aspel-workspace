import React from 'react';
import { CheckboxGroup } from '@ukhomeoffice/react-components';

export default function ApplicationConfirm({
    error,
    title = 'Please confirm that you understand',
    label,
    name = 'declaration'
}) {
    return (
        <div className="application-confirm">
            <CheckboxGroup
                name={name}
                label={title}
                options={[{ label, value: true }]}
                error={error}
            />
        </div>
    );
}
