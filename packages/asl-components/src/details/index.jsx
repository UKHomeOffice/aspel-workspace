import React, { useState } from 'react';

export default function Details({ summary, children, className, id }) {
    const [open, setOpen] = useState(false);

    function toggle(e) {
        if (e) {
            e.preventDefault();
        }
        setOpen((prev) => !prev);
    }

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
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        toggle(e);
                    }
                }}
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
