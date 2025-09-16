import React from 'react';
import Inset from '../inset';

const FlashBanner = ({ heading, body, className }) => {
    return (
        <Inset className={className}>
            {heading && <h2>{heading}</h2>}
            <p>{body}</p>
        </Inset>
    );
};

export default FlashBanner;
