import React, { useState, useMemo } from 'react';
import classnames from 'classnames';

const ExpandingPanel = ({
    isOpen: initialOpen = false,
    open: controlledOpen,
    onToggle,
    wrapTitle = true,
    title,
    children
}) => {
    const [internalOpen, setInternalOpen] = useState(initialOpen);

    // Determine if the component is controlled
    const isControlled = typeof controlledOpen === 'boolean';

    // Sync internal state when controlled prop changes
    useMemo(() => {
        if (isControlled) {
            setInternalOpen(controlledOpen);
        }
    }, [controlledOpen, isControlled]);

    // Toggle handler
    const toggle = () => {
        if (isControlled) {
            onToggle?.();
        } else {
            setInternalOpen(prev => !prev);
        }
    };

    return (
        <section className={`expanding-panel${internalOpen ? ' open' : ''}`}>
            <header onClick={toggle}>
                {wrapTitle ? <h3>{title}</h3> : title}
            </header>
            {internalOpen && (
                <div className={classnames('content', { hidden: !internalOpen })}>
                    {children}
                </div>
            )}
        </section>
    );
};

export default ExpandingPanel;
