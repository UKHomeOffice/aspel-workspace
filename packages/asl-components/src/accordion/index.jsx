import React, { useState, useEffect } from 'react';
import every from 'lodash/every';
import castArray from 'lodash/castArray';

const Accordion = ({ children, closeAll = 'Close all', openAll = 'Open all' }) => {
    const [open, setOpen] = useState([]);

    useEffect(() => {
        const initialOpen = children.map(child => (child.props && child.props.isOpen) ? child.props.isOpen : false);
        setOpen(initialOpen);
    }, [children]);

    const toggle = (i) => {
        setOpen(prevOpen => prevOpen.map((item, index) => index === i ? !item : item));
    };

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
                    onClick: () => toggle(i),
                    open: open[i],
                    'data-testid': `accordion-${i}`,
                    'data-open': open[i]
                }))
            }
        </div>
    );
};

export default Accordion;
