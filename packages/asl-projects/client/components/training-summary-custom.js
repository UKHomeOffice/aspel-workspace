import React from 'react';
import sortBy from 'lodash/sortBy';
import { Snippet, formatDate, DATE_FORMAT } from '@ukhomeoffice/asl-components';

function List({ items = [] }) {
  if (!items.length) {
    return '-';
  }

  return (
    <ul>
      {
        items.map((item, index) => <li key={index}>{item}</li>)
      }
    </ul>
  );
}

function Details({ certificate }) {
  if (certificate.isExemption) {
    return (
      <>
        <p className="preserve-whitespace">{certificate.exemptionReason}</p>
        <p>
          <span>Added on: </span>
          <span className="value">{certificate.createdAt ? formatDate(certificate.createdAt, DATE_FORMAT.long) : '-'}</span>
        </p>
      </>
    );
  }

  return (
    <p>
      <span>Certificate number: </span><span className="value">{certificate.certificateNumber || '-'}</span><br />
      <span>Awarded on: </span><span className="value">{certificate.passDate ? formatDate(certificate.passDate, DATE_FORMAT.long) : '-'}</span><br />
      <span>Awarded by: </span><span className="value">{certificate.accreditingBody === 'Other' ? certificate.otherAccreditingBody : certificate.accreditingBody}</span>
    </p>
  );
}

function Row({ certificate }) {
  return (
    <tr>
      <td>{certificate.isExemption ? 'Exemption' : 'Training certificate'}</td>
      <td><List items={(certificate.modules || []).map(module => <Snippet key={module}>{`trainingModules.${module}`}</Snippet>)} /></td>
      <td><List items={certificate.species || []} /></td>
      <td><Details certificate={certificate} /></td>
    </tr>
  );
}

export default function TrainingSummaryWithChangeHighlighting({ certificates = [] }) {
  if (!certificates.length) {
    return <p>No training record</p>;
  }

  const sortedCertificates = sortBy(certificates, ['isExemption', 'createdAt']);

  return (
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
        {
          sortedCertificates.map(certificate => <Row key={certificate.id} certificate={certificate} />)
        }
      </tbody>
    </table>
  );
}

