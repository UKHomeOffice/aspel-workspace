import React, { useState, useRef, useEffect, Fragment } from 'react';

const DownloadHeader = ({ title, subtitle, isGranted, basename, children, showWord = true, showPdf = true }) => {
  const [modalShowing, updateModalShowing] = useState(false);
  const [detailsShowing, updateDetailsShowing] = useState(false);
  const container = useRef(null);
  const download = useRef(null);

  // title could span multiple lines, adjust download position accordingly
  useEffect(() => {
    if (!showWord && !showPdf) {
      return;
    }
    // subtract padding, and border
    const height = container.current.offsetHeight - 30 - 4;
    download.current.style.height = `${height}px`;
    download.current.style.lineHeight = `${height}px`;
  });

  const toggleModal = (e, preventDefault = true) => {
    if (preventDefault) {
      e.preventDefault();
    }
    updateModalShowing(!modalShowing);
  };

  const toggleDetails = (e) => {
    e.preventDefault();
    updateDetailsShowing(!detailsShowing);
  };

  return (
    <div className="download-header" ref={container}>
      {
        (showWord || showPdf) && (
          <div className="right" ref={download}>
            <a href="#" className="download" onClick={toggleModal}>{`Download ${isGranted ? 'licence' : 'application'}`}</a>
            {
              modalShowing && (
                <div className="download-modal">
                  <a className="close" href="#" onClick={toggleModal}>✕</a>
                  { showPdf && <a href={`${basename}/pdf`} onClick={e => toggleModal(e, false)}>As PDF</a> }
                  { showPdf && showWord && <Fragment> | </Fragment> }
                  { showWord && <a href={`${basename}/docx`} onClick={e => toggleModal(e, false)}>As Word (.docx)</a> }
                </div>
              )
            }
          </div>
        )
      }
      <div className="left">
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
    </div>
  );
};

export default DownloadHeader;
