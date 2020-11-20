import React, { useState, Fragment } from 'react';

export default function DocumentHeader({ title, subtitle, backLink, children, detailsLabel = 'downloads' }) {
  const [detailsShowing, updateDetailsShowing] = useState(false);

  const toggleDetails = (e) => {
    e.preventDefault();
    updateDetailsShowing(!detailsShowing);
  };

  return (
    <header className="document-header">
      <div className="page-title">
        { title && <h1>{title}</h1> }
        { subtitle && <h2>{subtitle}</h2> }
        {
          children &&
            <Fragment>
              <a href="#" onClick={toggleDetails} className="toggle-details">
                { detailsShowing ? `Hide ${detailsLabel}` : `View ${detailsLabel}` }
              </a>
              {
                detailsShowing && <div className="details">{children}</div>
              }
            </Fragment>
        }
      </div>

      { backLink && <div className="back-link">{ backLink }</div> }
    </header>
  );
}
