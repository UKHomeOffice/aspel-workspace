import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {format as formatDate, isBefore} from 'date-fns';
import { dateFormat } from '@asl/pages/constants';

import {
  Link,
  Header,
  Snippet,
  FormLayout
} from '@ukhomeoffice/asl-components';
import formatters from '@asl/pages/pages/project/formatters';

export default function ProjectLandingPage() {
  const model = useSelector(state => state.model);
  const expiryInThePast = isBefore(model.newExpiryDate, new Date());

  return (
    <Fragment>
      <FormLayout>
        <Header
          subtitle={model.title}
          title={<Snippet>title</Snippet>}
        />

        <dl>
          <dt><Snippet>fields.duration.label</Snippet></dt>
          <dd>{formatters().duration.format(model.granted)}</dd>
        </dl>

        {
          expiryInThePast &&
            <div className="govuk-warning-text">
              <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
              <strong className="govuk-warning-text__text"><Snippet>expiryInThePast</Snippet></strong>
            </div>
        }

        <table className="govuk-table">
          <thead>
            <tr>
              <th></th>
              <th>Current</th>
              <th>Proposed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Date granted</th>
              <td>{formatDate(model.issueDate, dateFormat.long)}</td>
              <td><span className="highlight">{formatDate(model.newIssueDate, dateFormat.long)}</span></td>
            </tr>
            <tr>
              <th>Expiry date</th>
              <td>{formatDate(model.expiryDate, dateFormat.long)}</td>
              <td><span className="highlight">{formatDate(model.newExpiryDate, dateFormat.long)}</span></td>
            </tr>
          </tbody>
        </table>

      </FormLayout>

      <p><Link page="projectAsruActions.updateIssueDate" label="Choose another date" /></p>
    </Fragment>
  );
}
