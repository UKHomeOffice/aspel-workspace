import React from 'react';
import Inset from '../inset';
import { useSelector } from 'react-redux';
import { Markdown } from '../index';

const FlashBanner = () => {
    const flash = useSelector(state => state.static.flash);

    // only render if flash has content
    if (!flash || !flash.body) return null;

    return (
        <Inset className={`flash-banner--${flash.type || 'success'}`}>
            {flash.title && <h2>{flash.title}</h2>}
            <Markdown>{flash.body}</Markdown>
        </Inset>
    );
};

export default FlashBanner;
