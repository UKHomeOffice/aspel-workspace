import React, { useState, useMemo, useCallback } from 'react';
import every from 'lodash/every';
import castArray from 'lodash/castArray';

const Accordion = ({ children, closeAll = 'Close all', openAll = 'Open all' }) => {
    const initialOpen = useMemo(() =>
        React.Children.map(children, child => child?.props?.isOpen || false),
    []
    );

    const [open, setOpen] = useState(initialOpen);

    const toggle = useCallback(i => {
        setOpen(prevOpen => prevOpen.map((item, index) => index === i ? !item : item));
    }, [setOpen]);

    const allOpen = () => every(open);

    const toggleAll = () => {
        setOpen(prevOpen => prevOpen.map(() => !allOpen()));
    };

    return (
        <div className="accordion">
            <p className="toggles">
                <button onClick={toggleAll}>
                    {allOpen() ? closeAll : openAll}
                </button>
            </p>
            {
                castArray(children).map((child, i) => child && React.cloneElement(child, {
                    key: i,
                    onToggle: () => toggle(i),
                    open: open[i],
                    'data-testid': `accordion-${i}`,
                    'data-open': open[i]
                }))
            }
        </div>
    );
};

export default Accordion;
