import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

const selector = ({
  model,
  licenceType,
  isGranted,
  basename,
  showWord = true,
  showPdf = true
}) => ({
  model,
  licenceType,
  isGranted,
  basename,
  showWord,
  showPdf
});

export default function DownloadHeader() {
  const [modalShowing, updateModalShowing] = useState(false);
  const container = useRef(null);
  const download = useRef(null);
  const props = useSelector(selector, shallowEqual);

  const {
    model,
    licenceType,
    isGranted,
    basename,
    showWord,
    showPdf
  } = props;

  console.log('props', props);

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
    // subtract padding, and border
    const height = container.current.offsetHeight - 30 - 4;
    download.current.style.height = `${height}px`;
    download.current.style.lineHeight = `${height}px`;
  });

  function toggleModal(e) {
    e.preventDefault();
    updateModalShowing(!modalShowing);
  }

  return (
    <div className="download-header" ref={container}>
      <div className="right" ref={download}>
        <a href="#" className="download" onClick={toggleModal}>{`Download ${isGranted ? 'licence' : 'application'}`}</a>
        {
          modalShowing && (
            <div className="download-modal">
              <a className="close" href="#" onClick={toggleModal}>✕</a>
              { showPdf && <a href={`${basename}/pdf`}>As PDF</a> }
              { showPdf && showWord && <Fragment> | </Fragment> }
              { showWord && <a href={`${basename}/docx`}>As Word (.docx)</a> }
            </div>
          )
        }
      </div>
      <div className="left">
        <h2>{title}</h2>
      </div>
    </div>
  );
}
