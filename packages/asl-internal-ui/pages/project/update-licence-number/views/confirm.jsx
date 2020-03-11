import React from 'react';
import { useSelector } from 'react-redux';
import {
  Link,
  Header,
  Snippet,
  FormLayout
} from '@asl/components';

export default function ProjectLandingPage() {
  const model = useSelector(state => state.model);
  const licenceNumber = useSelector(state => state.static.licenceNumber);

  return (
    <FormLayout>
      <Header
        subtitle={model.title}
        title={<Snippet>title</Snippet>}
      />

      <table className="govuk-table">
        <thead>
          <tr>
            <th>Current</th>
            <th>Proposed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{model.licenceNumber}</td>
            <td><span className="highlight">{licenceNumber}</span></td>
          </tr>
        </tbody>
      </table>

      <p><Link page="projectAsruActions.updateLicenceNumber" label="Change" /></p>
    </FormLayout>
  );
}
