import React, { useState, Fragment } from 'react';

const DownloadHeader = ({ title, subtitle, basename, children, licenceStatus, showPdf = true, showAllDownloads = false }) => {
  const [detailsShowing, updateDetailsShowing] = useState(false);

  basename = basename.replace(/\/$/, '');

  const toggleDetails = (e) => {
    e.preventDefault();
    updateDetailsShowing(!detailsShowing);
  };

  let pdfLabel;

  switch (licenceStatus) {
    case 'active':
      pdfLabel = 'Granted licence';
      break;

    case 'expired':
      pdfLabel = 'Expired licence';
      break;

    case 'revoked':
      pdfLabel = 'Revoked licence';
      break;

    default:
      pdfLabel = 'Draft licence';
  }

  return (
    <div className="download-header">

      <div className="page-title">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        {
          children &&
            <Fragment>
              <a href="#" onClick={toggleDetails} className="toggle-details">
                {detailsShowing ? 'Hide details' : 'View details'}
              </a>
              {
                detailsShowing && <div className="details">{children}</div>
              }
            </Fragment>
        }
      </div>

      {
        (showPdf || showAllDownloads) && (
          <div className="download-options">
            <a href="#" className="toggle-download-options" onClick={toggleDetails}>
              {detailsShowing ? 'Hide download options' : 'View download options'}
            </a>
            {
              detailsShowing && (
                <div className="details">
                  {
                    showPdf && <p><a href={`${basename}/pdf`}>{`${pdfLabel} (.pdf)`}</a></p>
                  }
                  {
                    showAllDownloads && <p><a href={`${basename}/downloads`}>All downloads</a></p>
                  }
                </div>
              )
            }
          </div>
        )
      }

    </div>
  );
};

export default DownloadHeader;
