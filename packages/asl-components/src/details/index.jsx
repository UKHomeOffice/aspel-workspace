import React, { useState, useCallback } from 'react';

export default function Details({ summary, children, className, id }) {
    const [open, setOpen] = useState(false);

    const toggle = useCallback(
        e => {
            e?.preventDefault();
            setOpen((prev) => !prev);
        },
        [setOpen]
    );

    const toggleOnActivation = useCallback(
        e => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggle(e);
            }
        },
        [toggle]
    );

    return (
        <details
            className={className}
            open={open}
            aria-expanded={open}
        >
            <summary
                id={id}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-controls={`${id}-content`}
                onClick={toggle}
                onKeyDown={toggleOnActivation}
            >
                {summary}
            </summary>
            <div
                id={`${id}-content`}
                role="region"
                aria-labelledby={id}
                hidden={!open}
            >
                {children}
            </div>
        </details>
    );
}
