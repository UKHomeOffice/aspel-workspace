import React, { Fragment, useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { BackToTop } from '../';

export default function DocumentHeader({ title, subtitle, backLink, children, detailsLabel = 'downloads', status = null }) {
  const [detailsShowing, updateDetailsShowing] = useState(false);

  const toggleDetails = (e) => {
    e.preventDefault();
    updateDetailsShowing(!detailsShowing);
  };

  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);

  const handleScroll = () => {
    if (ref.current) {
      setSticky(ref.current.getBoundingClientRect().top <= 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  function Headings({ title, subtitle }) {
    if (isSticky) {
      return (
        <Fragment>
          <h2>
            {
              title
                ? <Fragment>{title}: {subtitle}</Fragment>
                : subtitle
            }
            {status}
          </h2>
        </Fragment>
      );
    }

    return (
      <Fragment>
        { title && <h1>{title} {status}</h1> }
        <div className="title-overflow">
          { subtitle && <h2>{subtitle}</h2> }
          {
            children && <a href="#" onClick={toggleDetails} className="toggle-details">
              { detailsShowing ? `Hide ${detailsLabel}` : `View ${detailsLabel}` }
            </a>
          }
        </div>
        {
          children && detailsShowing && <div className="details">{children}</div>
        }
      </Fragment>
    );
  }

  return (
    <div className={classnames('sticky-wrapper', { sticky: isSticky })} ref={ref}>

      <header className="document-header">
        <div className="page-title">
          <Headings title={title} subtitle={subtitle} />
        </div>

        { !isSticky && backLink && <div className="back-link">{ backLink }</div> }

        { isSticky && <BackToTop showAt={0} /> }
      </header>

    </div>
  );
}
