import React, { useState, useEffect } from 'react';
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
    useEffect(() => {
        if (isControlled) {
            setInternalOpen(controlledOpen);
        }
    }, [controlledOpen, isControlled]);

    // Determine the current open state
    const isOpen = isControlled ? controlledOpen : internalOpen;

    // Toggle handler
    const toggle = () => {
        if (isControlled) {
            onToggle?.();
        } else {
            setInternalOpen(prev => !prev);
        }
    };

    return (
        <section className={`expanding-panel${isOpen ? ' open' : ''}`}>
            <header onClick={toggle}>
                {wrapTitle ? <h3>{title}</h3> : title}
            </header>
            {isOpen && (
                <div className={classnames('content', { hidden: !isOpen })}>
                    {children}
                </div>
            )}
        </section>
    );
};

export default ExpandingPanel;
