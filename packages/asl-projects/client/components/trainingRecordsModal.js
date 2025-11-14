import React, { Fragment, useState } from 'react';
import classnames from 'classnames';
import Modal from './modal';

const DEFAULT_LABEL = 'No data available';

export default function TrainingRecordModal({
                                              current = {},
                                              previous = {},
                                              first = {},
                                              label = 'Training record changes'
                                            }) {

  const hasChanges = (a = {}, b = {}) => {
    const fieldsToCheck = ['modules', 'species', 'certificateNumber', 'passDate', 'accreditingBody', 'exemptionReason'];
    return fieldsToCheck.some(key => {
      const valA = Array.isArray(a[key]) ? [...a[key]].sort().join(',') : a[key];
      const valB = Array.isArray(b[key]) ? [...b[key]].sort().join(',') : b[key];
      return valA !== valB;
    });
  };

  const hasPrevChanges = hasChanges(previous, current);
  const hasFirstChanges = hasChanges(first, current);

  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState(() => {
    if (hasPrevChanges) return 0;
    if (hasFirstChanges) return 1;
    return 0;
  });

  const toggleModal = e => {
    e.preventDefault();
    setModalOpen(!modalOpen);
  };

  const selectTab = n => e => {
    e.preventDefault();
    setActive(n);
  };

  const certificateFields = [
    { label: 'Certificate Number', field: 'certificateNumber' },
    { label: 'Awarded On', field: 'passDate' },
    { label: 'Awarded By', field: 'accreditingBody' }
  ];

  const renderDiffFields = (data, compareTo, side) => {
    return certificateFields.map(({ label, field }) => (
      <p key={field}>
        {label}: {diffField(data[field], compareTo[field], side)}
      </p>
    ));
  };


  const diffField = (prev = '', next = '', side = 'left') => {
    if (prev === next) return <span>{next || <em>{DEFAULT_LABEL}</em>}</span>;
    if (side === 'left') return prev ? <span className="diff removed">{prev}</span> : <span>-</span>;
    if (side === 'right') return next ? <span className="diff added">{next}</span> : <span>-</span>;
  };

  const diffArray = (prevArr = [], nextArr = [], side = 'left') => {
    prevArr = Array.isArray(prevArr) ? prevArr : [];
    nextArr = Array.isArray(nextArr) ? nextArr : [];

    const removed = prevArr.filter(x => !nextArr.includes(x));
    const added = nextArr.filter(x => !prevArr.includes(x));
    const items = side === 'left' ? prevArr : nextArr;

    if (!items.length) return <p><em>{DEFAULT_LABEL}</em></p>;

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

  const leftPanel = (data, compareTo) => (
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
          <p className="preserve-whitespace"> {diffField(data.exemptionReason, compareTo.exemptionReason, 'left') || '-'}</p>
        ) : (
          <>
            {renderDiffFields(data, compareTo, 'left')}
          </>
        )}
      </div>
    </div>
  );

  const rightPanel = (data, compareTo) => (
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
          <p className="preserve-whitespace"> {diffField(data.exemptionReason, compareTo.exemptionReason, 'right') || '-'}</p>
        ) : (
          <>
            {renderDiffFields(compareTo, data, 'right')}
          </>
        )}
      </div>
    </div>
  );

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
              <nav className="govuk-tabs">
                <ul>
                  {hasFirstChanges && (
                    <li className={active === 1 ? 'active' : ''}>
                      <a href="#" onClick={selectTab(1)}>Initial submission</a>
                    </li>
                  )}
                  {hasPrevChanges && (
                    <li className={active === 0 ? 'active' : ''}>
                      <a href="#" onClick={selectTab(0)}>Previous version</a>
                    </li>
                  )}
                </ul>
              </nav>

              {active === 0
                ? leftPanel(previous, current)
                : leftPanel(first, current)}
            </div>

            {/* Right side always shows proposed */}
            <div className="govuk-grid-column-one-half">
              <h3>Proposed</h3>
              {rightPanel(current, active === 0 ? previous : first)}
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
