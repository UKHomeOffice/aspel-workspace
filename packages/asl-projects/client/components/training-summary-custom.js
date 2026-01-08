import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getStatus, getTrainingRecord, getRemovedTrainingRecords } from '../helpers/trainingRecordsComparison';
import TrainingRecordModal from './trainingRecordsModal';
import { format } from 'date-fns';
const DEFAULT_LABEL = '-';
export default function TrainingSummaryWithChangeHighlighting({
                                                                certificates = [],
                                                                comparisons = {},
                                                                project = {},
                                                                readonly

                                                              }) {
  const dateFormat = 'dd MMMM yyyy';
  const trainingHistory = useSelector(state => state.static.previousTraining);
  const versions = useSelector(state => state.static.project.versions);
  const previousVersion = useSelector(state => state.static.previousTraining.previous);
  const firstVersion = useSelector(state => state.static.previousTraining.first);
  const grantedVersion = useSelector(state => state.static.previousTraining.granted);
  const removedRecords = getRemovedTrainingRecords(comparisons, trainingHistory);

  // Map removed by ID for quick lookup
  const removedMap = removedRecords.reduce((map, r) => {
    map[r.trainingId || r.id] = r;
    return map;
  }, {});

  // Map current by id's
  const currentMap = certificates.reduce((map, r) => {
    map[r.trainingId || r.id] = r;
    return map;
  }, {});

  // Combine all records from previous, first, granted, and current versions
  const allRecords = [
    ...(Array.isArray(previousVersion) ? previousVersion : []),
    ...(Array.isArray(firstVersion) ? firstVersion : []),
    ...(Array.isArray(grantedVersion) ? grantedVersion : []),
    ...certificates
  ];

  // only keep unique records
  const uniqueRecords = Array.from(
    new Map(allRecords.map(record => [record.id || record.trainingId, record])).values()
  );
  // check if this is first submission
  const trainingHistoryRecords = versions.length > 1;
  // unset grey badge
  if (versions.length < 3) {
    comparisons.added[1].ids = [];
    comparisons.removed[1].ids = [];
    comparisons.changed[1].ids = [];

  }
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
        {uniqueRecords.map(record => {
          const status = getStatus(record, comparisons);
          return (
            <tr key={record.trainingId || record.id} className="govuk-table__row">
              <td className="govuk-table__cell training-col-category">
                <span>{record.isExemption ? 'Exemption' : 'Training certificate'}</span>
                <>
                  {trainingHistoryRecords && status && (
                  <div className="badge-wrapper">
                    <span className={`govuk-tag ${status.class}`}>{status.label}</span>
                    {status.label === 'CHANGED' && (
                      <TrainingRecordModal
                        current={getTrainingRecord(project, record, 'current', trainingHistory)}
                        previous={getTrainingRecord(project, record, 'previous', trainingHistory)}
                        first={getTrainingRecord(project, record, 'first', trainingHistory)}
                        comparisons={comparisons}
                        trainingHistory={trainingHistory}
                      />
                    )}
                  </div>
                )}
              </>
              </td>

              <td className="govuk-table__cell">
                {record.modules?.length ? (
                  <ul className="module-list">
                    {record.modules.map((mod, i) => (
                      <li key={i}>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  {DEFAULT_LABEL}
                )}
              </td>

              <td className="govuk-table__cell">
                {record.species?.length ? (
                  <ul className="species-list">
                    {record.species.map((sp, i) => (
                      <li key={i}>
                        <span>{sp}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  '-'
                )}
              </td>

              <td className="govuk-table__cell">
                {record.isExemption ? (
                  <p className="preserve-whitespace">{record.exemptionReason || '-'}</p>
                ) : (
                  <p className="certificate-details">
                    <span className="label">Certificate number: </span>
                    <span className="value">{record.certificateNumber || '-'}</span>
                    <br />
                    <span className="label">Awarded on: </span>
                    <span className="value">
                        {record.passDate ? format(record.passDate, dateFormat) : '-'}
                      </span>
                    <br />
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
