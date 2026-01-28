import React, { useState } from 'react';
import classnames from 'classnames';
import Modal from './modal';
import { useSelector } from 'react-redux';

const DEFAULT_LABEL = '-';

export default function TrainingRecordModal({
                                              current = {},
                                              previous = {},
                                              first = {},
                                              granted = {},
                                              label = 'Training or exemption change'
                                            }) {

  const normalise = obj => (obj && typeof obj === 'object' ? obj : {});

  const hasChanges = (a, b) => {
    a = normalise(a);
    b = normalise(b);

    const fieldsToCheck = [
      'modules',
      'species',
      'certificateNumber',
      'passDate',
      'accreditingBody',
      'exemptionReason'
    ];

    return fieldsToCheck.some(key => {
      const valA = Array.isArray(a[key]) ? [...a[key]].sort().join(',') : a[key];
      const valB = Array.isArray(b[key]) ? [...b[key]].sort().join(',') : b[key];
      return valA !== valB;
    });
  };

// check if there is any training record in previous or first/granted
  const isRealPrevRecord = previous && (previous.id || previous.trainingId);
  const isRealFirstRecord = first && (first.id || first.trainingId);
  const isRealFirstGrantedRecord = granted && (granted.id || granted.trainingId);
  const grantedVersion = useSelector(state => state);
  const modalLabel =
    grantedVersion?.application?.project?.granted !== undefined
      ? 'Current licence'
      : 'Initial submission';
  const projectVersion =  grantedVersion?.application?.project?.granted !== undefined ? granted : first
// Now determine change only if REAL record exists
  const hasPrevChanges = isRealPrevRecord && hasChanges(previous, current);
  const hasFirstChanges = isRealFirstRecord && hasChanges(first, current);
  const hasGrantedChanges = isRealFirstGrantedRecord && hasChanges(granted, previous);
  const showTabs = isRealPrevRecord && (isRealFirstRecord || isRealFirstGrantedRecord);
  const showPrevTab = showTabs && hasPrevChanges;
  const previousLabel =
    (hasGrantedChanges === true || hasFirstChanges === true)
      ? 'Previous version'
      : modalLabel;
  const showFirstTab = showTabs && (hasFirstChanges || hasGrantedChanges);

  // Decide initial active tab
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState(() => {
    if (hasPrevChanges) return 'prev';
    if (hasFirstChanges) return 'first';
    return 'prev';
  });

  const toggleModal = e => {
    e.preventDefault();
    setModalOpen(!modalOpen);
  };

  const selectTab = tab => e => {
    e.preventDefault();
    setActive(tab);
  };

  const certificateFields = [
    { label: 'Certificate Number', field: 'certificateNumber' },
    { label: 'Awarded On', field: 'passDate' },
    { label: 'Awarded By', field: 'accreditingBody' }
  ];

  const diffField = (prev = '', next = '', side = 'left') => {
    if (prev === next) {
      return <span>{next || <em>{DEFAULT_LABEL}</em>}</span>;
    }
    if (side === 'left') {
      return prev
        ? <span className="diff removed">{prev}</span>
        : <span>{DEFAULT_LABEL}</span>;
    }
    if (side === 'right') {
      return next
        ? <span className="diff added">{next}</span>
        : <span>{DEFAULT_LABEL}</span>;
    }
  };

  const renderDiffFields = (data = {}, compareTo = {}, side) => {
    data = normalise(data);
    compareTo = normalise(compareTo);
    return certificateFields.map(({ label, field }) => (
      <p key={field}>
        {label}: {diffField(data[field], compareTo[field], side)}
      </p>
    ));
  };

  const diffArray = (prevArr = [], nextArr = [], side = 'left') => {
    prevArr = Array.isArray(prevArr) ? prevArr : [];
    nextArr = Array.isArray(nextArr) ? nextArr : [];

    const removed = prevArr.filter(x => !nextArr.includes(x));
    const added = nextArr.filter(x => !prevArr.includes(x));
    const items = side === 'left' ? prevArr : nextArr;

    if (!items.length) {
      return (
        <p>
          <em>{DEFAULT_LABEL}</em>
        </p>
      );
    }

    return (
      <ul>
        {items.map(item => {
          const isRemoved = side === 'left' && removed.includes(item);
          const isAdded = side === 'right' && added.includes(item);

          return (
            <li key={item}>
              <span
                className={classnames({
                  removed: isRemoved,
                  added: isAdded,
                  diff: isRemoved || isAdded
                })}
              >
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const leftPanel = (data, compareTo) => {
    data = normalise(data);
    compareTo = normalise(compareTo);

    return (
    <div className="main-left-panel-wrapper">
    <div className="panel light-grey before">
      <div className="govuk-form-group">
        <strong>Modules</strong>
          {diffArray(data.modules, compareTo.modules, 'left')}
        </div>
        <div className="govuk-form-group">
          <strong>Species</strong>
          {diffArray(data.species, compareTo.species, 'left')}
        </div>
        <div className="govuk-form-group">
          <strong>Details</strong>
          {data.isExemption ? (
            <p className="preserve-whitespace">
              {diffField(
                data.exemptionReason,
                compareTo.exemptionReason,
                'left'
              ) || '-'}
            </p>
          ) : (
            <>
              {renderDiffFields(data, compareTo, 'left')}
            </>
          )}
        </div>
      </div>
      </div>
    );
  };

  const rightPanel = (data, compareTo) => {
    data = normalise(data);
    compareTo = normalise(compareTo);

    return (
      <div className="panel light-grey after">
        <div className="govuk-form-group">
          <strong>Modules</strong>
          {diffArray(compareTo.modules, data.modules, 'right')}
        </div>
        <div className="govuk-form-group">
          <strong>Species</strong>
          {diffArray(compareTo.species, data.species, 'right')}
        </div>
        <div className="govuk-form-group">
          <strong>Details</strong>
          {data.isExemption ? (
            <p className="preserve-whitespace">
              {diffField(
                data.exemptionReason,
                compareTo.exemptionReason,
                'right'
              ) || '-'}
            </p>
          ) : (
            <>
              {renderDiffFields(compareTo, data, 'right')}
            </>
          )}
        </div>
      </div>
    );
  };

  return modalOpen ? (
    <Modal onClose={toggleModal}>
      <div className="diff-window">
        <div className="diff-window-header">
          <h1>See what's changed</h1>
          <a href="#" className="float-right close" onClick={toggleModal}>
            Close
          </a>
        </div>

        <div className="diff-window-body">
          <h2>{label}</h2>

          <div className="govuk-grid-row">
            {/* Left side with tabs */}
            <div className="govuk-grid-column-one-half">
              {!(showPrevTab && showFirstTab) ? (
                <h3>{active === 'first' ? modalLabel : previousLabel}</h3>
              ) : (
                <nav className="govuk-tabs">
                <ul>
                    {showFirstTab && (
                      <li className={active === 'first' ? 'active' : ''}>
                        <a href="#" onClick={selectTab('first')}>
                          {modalLabel}
                        </a>
                      </li>
                    )}
                    {showPrevTab && (
                      <li className={active === 'prev' ? 'active' : ''}>
                        <a href="#" onClick={selectTab('prev')}>
                          {previousLabel}
                        </a>
                      </li>
                    )}
                  </ul>
                </nav>
              )}

              {active === 'prev' && showPrevTab
                ? leftPanel(previous, current)
                : showFirstTab
                  ? leftPanel(projectVersion, current)
                  : leftPanel(previous, current)}
            </div>

            {/* Right side Proposed container */}
            <div className="govuk-grid-column-one-half">
              <h3>Proposed</h3>
              {active === 'prev' && showPrevTab
                ? rightPanel(current, previous)
                : showFirstTab
                  ? rightPanel(current, projectVersion)
                  : rightPanel(current, previous)}
            </div>
          </div>
        </div>

        <div className="diff-window-footer">
          <h3>
            <a href="#" className="float-right close" onClick={toggleModal}>
              Close
            </a>
          </h3>
        </div>
      </div>
    </Modal>
  ) : (
    <a href="#" className="modal-trigger" onClick={toggleModal}>
      See what's <span className="changedText">changed</span>
    </a>
  );
}
