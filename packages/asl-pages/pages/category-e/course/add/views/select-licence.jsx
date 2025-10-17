import React, { useMemo } from 'react';
import { Datatable, FormLayout, Link, Snippet } from '@ukhomeoffice/asl-components';
import { useSelector } from 'react-redux';
import { formatDate, formatProjectLicenceNumber, formatSpecies } from '../../../formatters';
import { InputWrapper } from '@ukhomeoffice/react-components';

const tableFormatters = (establishmentId, value) => ({
  id: {
    className: 'govuk-radios--small',
    format(id, project) {
      return <div className="govuk-radios__item" key={id}>
        <input
          className="govuk-radios__input"
          id={`project-${id}`}
          type="radio"
          name={'projectId'}
          value={id}
          defaultChecked={value === id}
          aria-label={`${project.projectTitle}, expiry date ${formatDate(project.expiryDate)}`}
        />
        <label className="govuk-label govuk-radios__label" htmlFor={`project-${id}`}>&nbsp;</label>
      </div>;
    }
  },
  species: {
    format: (species) => formatSpecies(species)
  },
  licenceNumber: {
    format: (licenceNumber, project) => formatProjectLicenceNumber(licenceNumber, establishmentId, project.id)
  },
  expiryDate: {
    format: (startDate, course) => formatDate(startDate, course.endDate)
  }
});

const formFormatters = (establishmentId) => ({
  projectId: {
    component: (props) =>
      <InputWrapper {...props}>
        <Datatable
          tableProps={{
            id: props.name,
            'aria-labelledby': `${props.name}-legend`,
            'aria-describedby': `${props.name}-description`
          }}
          formatters={tableFormatters(establishmentId, props.value)}
          pagination={{ autoUI: true }}
        />
      </InputWrapper>,
    additionalContent: <Description establishmentId={establishmentId} />
  }
});

const Description = ({establishmentId}) =>
  <p id={'projectId-description'}>
    <Snippet>bodyText</Snippet><br />
    <Link
      page="project.list"
      establishmentId={establishmentId}
      label={<Snippet>projectPageLink</Snippet>}
    />
  </p>;

export default function SelectProjectLicencePage() {
  const { establishment } = useSelector(state => state.static);
  const hasData = useSelector(state => state.datatable.data.rows.length) > 0;
  const formatters = useMemo(() => formFormatters(establishment.id), [establishment.id]);

  return hasData
    ? <FormLayout
      fullWidth
      cancelLink={'categoryE.course.list'}
      formatters={formatters}
      formProps={{'aria-describedby': 'projectId-description'}}
    />
    : <>
      <h1><Snippet>pageTitle</Snippet></h1>
      <Description establishmentId={establishment.id} />
    </>;
}
