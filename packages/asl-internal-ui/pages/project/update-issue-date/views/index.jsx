import React from 'react';
import dayJs from '@ukhomeoffice/asl-components/src/dayjs.js';
import { useSelector } from 'react-redux';
import { dateFormat } from '@asl/pages/constants';

import {
  Header,
  Snippet,
  FormLayout
} from '@ukhomeoffice/asl-components';
import formatters from '@asl/pages/pages/project/formatters';

const {format: formatDate} = dayJs;

export default function ProjectLandingPage() {
  const model = useSelector(state => state.model);

  return (
    <FormLayout>
      <Header
        subtitle={model.title}
        title={<Snippet>title</Snippet>}
      />

      <div className="govuk-inset-text">
        <p><Snippet>summary</Snippet></p>
      </div>

      <dl>
        <dt><Snippet>fields.duration.label</Snippet></dt>
        <dd>{formatters().duration.format(model.granted)}</dd>

        <dt><Snippet>fields.expiryDate.label</Snippet></dt>
        <dd>{formatDate(model.expiryDate, dateFormat.long)}</dd>

        <dt><Snippet>fields.issueDate.label</Snippet></dt>
        <dd>{formatDate(model.issueDate, dateFormat.long)}</dd>
      </dl>
    </FormLayout>
  );
}
