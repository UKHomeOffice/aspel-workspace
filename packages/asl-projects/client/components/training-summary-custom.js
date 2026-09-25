import React from 'react';
import { useSelector } from 'react-redux';
import aslComponentUtils from '@ukhomeoffice/asl-components/utils.js';
import { getStatus, getTrainingRecord } from '../helpers/trainingRecordsComparison';
import TrainingRecordModal from './trainingRecordsModal';

const { formatDate, DATE_FORMAT } = aslComponentUtils;
const DEFAULT_LABEL = '-';
const NO_RECORDS_LABEL = 'No training record';

const CATEGORY_HEADERS = ['Category', 'Modules', 'Animal types', 'Details'];

const getHistoricalRecords = trainingHistory => ({
  previous: Array.isArray(trainingHistory?.previous) ? trainingHistory.previous : [],
  first: Array.isArray(trainingHistory?.first) ? trainingHistory.first : [],
  granted: Array.isArray(trainingHistory?.granted) ? trainingHistory.granted : []
});

const getUniqueRecords = ({ previous, first, granted }, certificates) => {
  const allRecords = [
    ...previous,
    ...first,
    ...granted,
    ...certificates
  ];

  return Array.from(
    new Map(allRecords.map(record => [record.id || record.trainingId, record])).values()
  );
};

const hasGrantedVersion = granted => {
  return granted !== null && granted !== undefined && Object.keys(granted).length > 0;
};

const normaliseComparisons = (comparisons = {}, versions = []) => {
  if (versions.length >= 3) {
    return comparisons;
  }

  return ['added', 'removed', 'changed'].reduce((acc, key) => {
    const groups = Array.isArray(comparisons[key]) ? [...comparisons[key]] : [];

    if (groups[1]) {
      groups[1] = { ...groups[1], ids: [] };
    }

    return {
      ...acc,
      [key]: groups
    };
  }, { ...comparisons });
};

function ValueList({ className, items = [] }) {
  if (!items.length) {
    return DEFAULT_LABEL;
  }

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index}>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CategoryCell({ record, comparisons, trainingHistory, trainingHistoryRecords, applicationGrantedStatus, project }) {
  const status = getStatus(record, comparisons, applicationGrantedStatus);

  return (
    <td className="govuk-table__cell training-col-category">
      <span>{record.isExemption ? 'Exemption' : 'Training certificate'}</span>
      {
        trainingHistoryRecords && status && (
          <div className="badge-wrapper">
            <span className={`govuk-tag ${status.class}`}>{status.label}</span>
            {
              ['CHANGED', 'AMENDED'].includes(status.label) && (
                <TrainingRecordModal
                  current={getTrainingRecord(project, record, 'current', trainingHistory)}
                  previous={getTrainingRecord(project, record, 'previous', trainingHistory)}
                  first={getTrainingRecord(project, record, 'first', trainingHistory)}
                  granted={getTrainingRecord(project, record, 'granted', trainingHistory)}
                  comparisons={comparisons}
                  trainingHistory={trainingHistory}
                />
              )
            }
          </div>
        )
      }
    </td>
  );
}

function DetailsCell({ record }) {
  if (record.isExemption) {
    return (
      <td className="govuk-table__cell">
        <>
          <p className="exceptionNote">
            <span className="label">Added on: </span>
            <span className="value">{record.createdAt ? formatDate(record.createdAt, DATE_FORMAT.long) : DEFAULT_LABEL}</span>
          </p>
          <br />
          <p className="preserve-whitespace">{record.exemptionReason || DEFAULT_LABEL}</p>
        </>
      </td>
    );
  }

  return (
    <td className="govuk-table__cell">
      <p className="certificate-details">
        <span className="label">Certificate number: </span>
        <span className="value">{record.certificateNumber || DEFAULT_LABEL}</span>
        <br />
        <span className="label">Awarded on: </span>
        <span className="value">{record.passDate ? formatDate(record.passDate, DATE_FORMAT.long) : DEFAULT_LABEL}</span>
        <br />
        <span className="label">Awarded by: </span>
        <span className="value">{record.accreditingBody || DEFAULT_LABEL}</span>
      </p>
    </td>
  );
}

function TrainingRow({ record, comparisons, trainingHistory, trainingHistoryRecords, applicationGrantedStatus, project }) {
  return (
    <tr key={record.trainingId || record.id} className="govuk-table__row">
      <CategoryCell
        record={record}
        comparisons={comparisons}
        trainingHistory={trainingHistory}
        trainingHistoryRecords={trainingHistoryRecords}
        applicationGrantedStatus={applicationGrantedStatus}
        project={project}
      />
      <td className="govuk-table__cell">
        <ValueList className="module-list" items={record.modules} />
      </td>
      <td className="govuk-table__cell">
        <ValueList className="species-list" items={record.species} />
      </td>
      <DetailsCell record={record} />
    </tr>
  );
}

export default function TrainingSummaryWithChangeHighlighting(
  { certificates = [], comparisons = {}, project = {} }
) {
  const trainingHistory = useSelector(state => state.static.previousTraining);
  const versions = useSelector(state => state.static.project?.versions ?? []);

  const historicalRecords = getHistoricalRecords(trainingHistory);
  const uniqueRecords = getUniqueRecords(historicalRecords, certificates);

  if (!uniqueRecords.length) {
    return <p>{NO_RECORDS_LABEL}</p>;
  }

  const trainingHistoryRecords = versions.length > 1;
  const mergedComparisons = normaliseComparisons(comparisons, versions);
  const applicationGrantedStatus = hasGrantedVersion(trainingHistory?.granted);

  return (
    <div className="training-summary-custom">
      <table className="govuk-table training">
        <thead>
        <tr>
          {CATEGORY_HEADERS.map(header => <th key={header}>{header}</th>)}
        </tr>
        </thead>
        <tbody>
        {uniqueRecords.map(record => (
          <TrainingRow
            key={record.trainingId || record.id}
            record={record}
            comparisons={mergedComparisons}
            trainingHistory={trainingHistory}
            trainingHistoryRecords={trainingHistoryRecords}
            applicationGrantedStatus={applicationGrantedStatus}
            project={project}
          />
        ))}
        </tbody>
      </table>
    </div>
  );
}
