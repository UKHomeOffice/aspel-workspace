import React from 'react';

// eslint-disable-next-line react/display-name
const NavAnchor = React.forwardRef((props, ref) => (
    <div ref={ref} id={props.id} className="sticky-nav-anchor">
        {props.children}
    </div>
));

export default NavAnchor;
