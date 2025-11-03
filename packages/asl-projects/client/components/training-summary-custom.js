import React from 'react';
import {getStatus, getTrainingRecord, getRemovedTrainingRecords } from '../helpers/trainingRecordsComparison';
import TrainingRecordModal from './trainingRecordsModal';

export default function TrainingSummaryCustom({
                                                certificates = [],
                                                comparisons = {},
                                                project = {},
                                                readonly

                                              }) {
  // Combine current + unique removed records (for display only)
  const removedRecords = getRemovedTrainingRecords(comparisons, project);
  const allRecords = [...certificates, ...removedRecords];


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
                        current={getTrainingRecord(project.trainingHistory, record.trainingId || record.id, 'current')}
                        previous={getTrainingRecord(project.trainingHistory, record.trainingId || record.id, 'previous')}
                        first={getTrainingRecord(project.trainingHistory, record.trainingId || record.id, 'first')}
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
                    <span className="value">{record.passDate || '-'}</span><br />
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
