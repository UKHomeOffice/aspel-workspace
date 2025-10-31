import React from 'react';
import TrainingRecordModal from './trainingRecordsModal';

/**
 * Custom wrapper around TrainingSummary table
 * Adds badges (NEW/REMOVED/CHANGED) without adding new <td> columns or altering layout.
 */
export default function TrainingSummaryCustom({
                                                certificates = [],
                                                comparisons = {},
                                                project = {},
                                                readonly
                                              }) {
  const { added = [], removed = [], changed = [] } = comparisons;

  // Helper: find the colour (pink/gray) associated with an ID
  const findColor = (groups, id) => {
    const group = groups.find(g => (g.ids || []).includes(id));
    return group ? group.color : null;
  };

  // Determine tag and colour
  const getStatus = id => {
    const addedColor = findColor(added, id);
    const removedColor = findColor(removed, id);
    const changedColor = findColor(changed, id);

    if (addedColor) {
      return { label: 'NEW', class: `badge created ${addedColor}`, color:{changedColor }};
    }
    if (removedColor) {
      return { label: 'REMOVED', class: `badge deleted ${removedColor}`, color:{changedColor }};
    }
    if (changedColor) {
      return { label: 'CHANGED', class: `badge changed ${changedColor}`, color:{changedColor} };
    }
    return null;
  };

  // Combine current + removed (for display only)
  const removedRecords = (comparisons.removed || [])
    .flatMap(r => r.ids || [])
    .map(id => {
      const prev =
        project.trainingHistory?.[project.trainingHistory.length - 1]?.trainingRecords?.find(
          r => r.trainingId === id
        );
      return prev ? { ...prev, id } : null;
    })
    .filter(Boolean);

  const allRecords = [...certificates, ...removedRecords];


  function getTrainingRecord(data = [], trainingId, versionType = 'current') {
    if (!Array.isArray(data) || !trainingId) {
      return null;
    }

    const versionsWithRecord = data.filter(
      v => Array.isArray(v.trainingRecords) &&
        v.trainingRecords.some(r => r.trainingId === trainingId)
    );

    if (versionsWithRecord.length === 0) {
      return null;
    }

    let targetVersion;

    switch (versionType.toLowerCase()) {
      case 'first':
        // very first submission → last element in the list
        targetVersion = versionsWithRecord[versionsWithRecord.length - 1];
        break;

      case 'previous':
        // one before the current → second element if available
        targetVersion =
          versionsWithRecord.length > 1
            ? versionsWithRecord[1]
            : versionsWithRecord[0];
        break;

      case 'current':
      default:
        // current (latest) → first element
        targetVersion = versionsWithRecord[0];
        break;
    }

    const record = targetVersion.trainingRecords.find(r => r.trainingId === trainingId);
    return record || null;
  }



  return (
    <div className="training-summary-custom">
      <style>{`
     span.govuk-tag.badge.created.gray,
     span.govuk-tag.badge.changed.gray,
     span.govuk-tag.badge.deleted.gray {
        background: #6F777B !important;
    }
      #ppl-drafting-tool .modal-trigger {
          margin-left: 0;
          float: left;
          font-size: 16px;
          margin-top: 10px;
      }
      span.changedText {
          padding-left: 32px;
      }
      `}</style>

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
          const status = getStatus(record.id);
          return (
            <tr key={record.id} className="govuk-table__row">
              <td className="govuk-table__cell training-col-category">
                <span>{record.isExemption ? 'Exemption' : 'Training certificate'}</span>
                <div className="badge-container">
                  {status && (
                    <div className="badge-wrapper">
                    <span className={`govuk-tag ${status.class}`}>
                      {status.label}
                    </span>
                      {status?.label === 'CHANGED' && (
                        <TrainingRecordModal
                          current={getTrainingRecord(project.trainingHistory, record.id, 'current')}
                          previous={getTrainingRecord(project.trainingHistory, record.id, 'previous')}
                          first={getTrainingRecord(project.trainingHistory, record.id, 'first')}
                          comparisons={comparisons}
                          trainingHistory={project.trainingHistory}
                        />
                      )}

                    </div>
                  )}

                </div>
              </td>

              <td className="govuk-table__cell">
                {record.modules?.length ? (
                  <ul className="module-list">
                    {record.modules.map((mod, index) => (
                      <li key={index}>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  '-'
                )}
              </td>


              <td className="govuk-table__cell">
                {record.species?.length ? (
                  <ul className="species-list">
                    {record.species.map((sp, index) => (
                      <li key={index}>
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
                  // Exemption view
                  <p className="preserve-whitespace">
                    {record.exemptionReason || '-'}
                  </p>
                ) : (
                  // Training certificate view
                  <p className="certificate-details">
                    <span className="label">Certificate number: </span>
                    <span className="value">{record.certificateNumber || '-'}</span>
                    <br />

                    <span className="label">Awarded on: </span>
                    <span className="value">{record.passDate || '-'}</span>
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
