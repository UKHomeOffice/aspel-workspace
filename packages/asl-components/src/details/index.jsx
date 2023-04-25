import React, { useState, useEffect } from 'react';

export default function Details({ summary, children, className }) {
    const [open, setOpen] = useState(true);

    function toggle() {
        setOpen(!open);
    }

    useEffect(() => {
        toggle();
    }, []);

    return (
        <details className={className} open={open}>
            <summary onClick={toggle}>{ summary }</summary>
            { children }
        </details>
    );
}
