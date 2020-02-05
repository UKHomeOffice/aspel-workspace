import React, { useState, Fragment } from 'react';

const DownloadHeader = ({ title, subtitle, basename, children, licenceStatus, showWord = true, showPdf = true }) => {
  const [detailsShowing, updateDetailsShowing] = useState(false);

  const toggleDetails = (e) => {
    e.preventDefault();
    updateDetailsShowing(!detailsShowing);
  };

  const wordLabel = 'Full application';
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
        (showWord || showPdf) && (
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
                    showWord && <p><a href={`${basename}/docx`}>{`${wordLabel} (.docx)`}</a></p>
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
