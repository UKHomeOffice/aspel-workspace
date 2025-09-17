import React from 'react';
import Inset from '../inset';

const FlashBanner = ({ title, body, type }) => {
    return (
        <Inset className={`flash-banner--${type}`}>
            {title && <h2>{title}</h2>}
            <p>{body}</p>
        </Inset>
    );
};

export default FlashBanner;
