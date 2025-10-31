import React, { Fragment, useState } from 'react';
import classnames from 'classnames';
import Modal from './modal';
import Tabs from './tabs';
import { Warning } from '@ukhomeoffice/react-components';

const DEFAULT_LABEL = 'No data available';

export default function trainingRecordModal({
                                          current = {},
                                          previous = {},
                                          first = {},
                                          label = 'Training record changes'
                                        }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState(0);

  const toggleModal = e => {
    e.preventDefault();
    setModalOpen(!modalOpen);
  };

  const selectTab = n => e => {
    e.preventDefault();
    setActive(n);
  };

  // Define this here (NOT inside JSX)
  const hasPrevChanges = JSON.stringify(current) !== JSON.stringify(previous);
  // Field difference display
  const diffField = (prev = '', next = '', side = 'left') => {
    if (prev === next) return <span>{next || <em>{DEFAULT_LABEL}</em>}</span>;

    if (side === 'left') {
      // Show only removed
      return prev ? <span className="diff removed">{prev}</span> : <span>-</span>;
    }
    if (side === 'right') {
      // Show only added
      return next ? <span className="diff added">{next}</span> : <span>-</span>;
    }
  };

  // 🧩 Array (modules/species) difference display
  const diffArray = (prevArr = [], nextArr = [], side = 'left') => {
    const removed = prevArr.filter(x => !nextArr.includes(x));
    const added = nextArr.filter(x => !prevArr.includes(x));
    let items = [];

    if (side === 'left') {
      items = removed.length ? removed : prevArr;
    } else {
      items = added.length ? added : nextArr;
    }

    if (!items.length) return <p><em>{DEFAULT_LABEL}</em></p>;

    return (
      <ul>
        {items.map(item => (
          <li key={item}>
            <span
              className={classnames({
                removed: side === 'left' && removed.includes(item),
                added: side === 'right' && added.includes(item),
                diff:
                  (side === 'left' && removed.includes(item)) ||
                  (side === 'right' && added.includes(item))
              })}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // 🧩 Main comparison layout
  const compareView = (leftLabel, leftData, rightLabel, rightData) => (
    <Fragment>
      <div className="govuk-grid-row">
        {/* LEFT SIDE: removed */}
        <div className="govuk-grid-column-one-half ">
          <h3>{leftLabel}</h3>
          <div className="panel light-grey before">
            <div className="govuk-form-group">
              <strong>Modules</strong>
              {diffArray(leftData.modules, rightData.modules, 'left')}
            </div>
            <div className="govuk-form-group">
              <strong>Species</strong>
              {diffArray(leftData.species, rightData.species, 'left')}
            </div>
            <div className="govuk-form-group">
              <strong>Details</strong>
              <p>Certificate Number: {diffField(leftData.certificateNumber, rightData.certificateNumber, 'left')}</p>
              <p>Awarded On: {diffField(leftData.passDate, rightData.passDate, 'left')}</p>
              <p>Awarded By: {diffField(leftData.accreditingBody, rightData.accreditingBody, 'left')}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: added */}
        <div className="govuk-grid-column-one-half">
          <h3>{rightLabel}</h3>
          <div className="panel light-grey after">
            <div className="govuk-form-group">
              <strong>Modules</strong>
              {diffArray(leftData.modules, rightData.modules, 'right')}
            </div>
            <div className="govuk-form-group">
              <strong>Species</strong>
              {diffArray(leftData.species, rightData.species, 'right')}
            </div>
            <div className="govuk-form-group">
              <strong>Details</strong>
              <p>Certificate Number: {diffField(leftData.certificateNumber, rightData.certificateNumber, 'right')}</p>
              <p>Awarded On: {diffField(leftData.passDate, rightData.passDate, 'right')}</p>
              <p>Awarded By: {diffField(leftData.accreditingBody, rightData.accreditingBody, 'right')}</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );

  // 🧩 No visible change warning
  const noChanges =
    JSON.stringify(current) === JSON.stringify(previous) &&
    JSON.stringify(previous) === JSON.stringify(first);

  const renderBody = () => {
    if (noChanges) {
      return (
        <Warning>
          <p>No visible differences detected. There may be metadata-only changes.</p>
        </Warning>
      );
    }

    if (active === 0) {
      return compareView('Previous version', previous, 'Proposed version', current);
    }

    if (active === 1) {
      return compareView('Initial submission', first, 'Current version', current);
    }

    return null;
  };

  // 🧩 Final Render
  return modalOpen ? (
    <Modal onClose={toggleModal}>
      <div className="diff-window">
        <div className="diff-window-header">
          <h1>See what&apos;s changed</h1>
          <a href="#" className="float-right close" onClick={toggleModal}>
            Close
          </a>
        </div>

        <div className="diff-window-body">
          <div className="diff-window-body">
            <h2>{label}</h2>
            {hasPrevChanges ? (
              <>
                <Tabs active={active}>
                  <a href="#" onClick={selectTab(0)}> Previous submission vs Proposed submission </a>
                  <a href="#" onClick={selectTab(1)}>Initial submission vs Current submission</a>
                </Tabs>
                <h2>&nbsp;</h2>
                {active === 0
                  ? compareView('Previous version', previous, 'Proposed version', current)
                  : compareView('Initial submission', first, 'Proposed', current)}
              </>
            ) : (
              <>
                {compareView('Initial submission', first, 'Proposed', current)}
              </>
            )}
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
      See what&apos;s <span className="changedText">changed</span>
    </a>
  );
}
