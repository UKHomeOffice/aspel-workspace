import React, { useState, useEffect } from 'react';
import classnames from 'classnames';

const BackToTop = ({ showAt = 400 }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (!isVisible && window.scrollY > showAt) {
            setIsVisible(true);
        } else if (isVisible && window.scrollY < showAt) {
            setIsVisible(false);
        }
    };

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isVisible, showAt]);

    return (
        <div className={classnames('back-to-top', { hidden: !isVisible })}>
            <p><a href="#" onClick={scrollToTop}>Back to top</a></p>
        </div>
    );
};

export default BackToTop;
