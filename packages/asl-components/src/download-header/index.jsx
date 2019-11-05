import React, { useState, useRef, useEffect, Fragment } from 'react';

const DownloadHeader = ({ model, licenceType, isGranted, basename, showWord = true, showPdf = true }) => {
  const [modalShowing, updateModalShowing] = useState(false);
  const container = useRef(null);
  const download = useRef(null);
  let title = 'Licence';

  switch (licenceType) {
    case 'ppl':
      title = model.title || 'Untitled project';
      break;
    case 'pil':
      title = 'Personal licence';
      break;
    case 'pel':
      title = 'Establishment licence';
      break;
  }

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
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default DownloadHeader;
