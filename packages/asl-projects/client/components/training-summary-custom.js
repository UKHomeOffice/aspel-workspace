import React from 'react';
import {getStatus, getTrainingRecord, getRemovedTrainingRecords } from '../helpers/trainingRecordsComparison';
import TrainingRecordModal from './trainingRecordsModal';
import { format } from 'date-fns';

export default function TrainingSummaryWithChangeHighlighting({
                                                certificates = [],
                                                comparisons = {},
                                                project = {},
                                                readonly

                                              }) {

  // reordering the array
  const history = project.trainingHistory || [];
  const previousVersion = history[1] || history[0] || {};
  const firstVersion = history[history.length - 1] || {};

  const removedRecords = getRemovedTrainingRecords(comparisons, project);
  const dateFormat = 'dd MMMM yyyy';
// Map removed by ID for quick lookup
  const removedMap = removedRecords.reduce((map, r) => {
    map[r.trainingId || r.id] = r;
    return map;
  }, {});

// Map current by ID as well
  const currentMap = certificates.reduce((map, r) => {
    map[r.trainingId || r.id] = r;
    return map;
  }, {});

// Build list preserving previous order
  let allRecords = [];
  if (Array.isArray(previousVersion.trainingRecords)) {
    allRecords = previousVersion.trainingRecords.map(prev => {
      const id = prev.trainingId || prev.id;
      return currentMap[id] || removedMap[id] || prev;
    });
  }

// Include any truly new ones not in previous
  const previousIds = (previousVersion.trainingRecords || []).map(r => r.trainingId || r.id);
  const newOnes = certificates.filter(r => !previousIds.includes(r.trainingId || r.id));

  allRecords = [...allRecords, ...newOnes];

  return (
    <div className="training-summary-custom">
      <table className="govuk-table training">
        <thead>
        <tr>
          <th>Category</th>
          <th>Modules</th>
          <th>Animal types</th>
          <th>Details</th>
        </tr>
        </thead>
        <tbody>
        {allRecords.map(record => {
          const status = getStatus(record, comparisons);
          return (
            <tr key={record.trainingId || record.id} className="govuk-table__row">
              <td className="govuk-table__cell training-col-category">
                <span>{record.isExemption ? 'Exemption' : 'Training certificate'}</span>
                {status && (
                  <div className="badge-wrapper">
                    <span className={`govuk-tag ${status.class}`}>{status.label}</span>

                    {status.label === 'CHANGED' && (
                      <TrainingRecordModal
                        current={getTrainingRecord(project, record, 'current')}
                        previous={getTrainingRecord(project, record, 'previous')}
                        first={getTrainingRecord(project, record, 'first')}
                        comparisons={comparisons}
                        trainingHistory={project.trainingHistory}
                      />
                    )}
                  </div>
                )}
              </td>

              <td className="govuk-table__cell">
                {record.modules?.length ? (
                  <ul className="module-list">
                    {record.modules.map((mod, i) => (
                      <li key={i}><span>{mod}</span></li>
                    ))}
                  </ul>
                ) : '-'}
              </td>

              <td className="govuk-table__cell">
                {record.species?.length ? (
                  <ul className="species-list">
                    {record.species.map((sp, i) => (
                      <li key={i}><span>{sp}</span></li>
                    ))}
                  </ul>
                ) : '-'}
              </td>

              <td className="govuk-table__cell">
                {record.isExemption ? (
                  <p className="preserve-whitespace">{record.exemptionReason || '-'}</p>
                ) : (
                  <p className="certificate-details">
                    <span className="label">Certificate number: </span>
                    <span className="value">{record.certificateNumber || '-'}</span><br />
                    <span className="label">Awarded on: </span>
                    <span className="value"> {record.passDate ? format(record.passDate, dateFormat) : '-'}</span><br />
                    <span className="label">Awarded by: </span>
                    <span className="value">{record.accreditingBody || '-'}</span>
                  </p>
                )}
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}
