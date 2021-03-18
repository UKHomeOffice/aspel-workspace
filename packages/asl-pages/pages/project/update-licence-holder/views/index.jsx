import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Form,
  ErrorSummary,
  Header,
  Snippet,
  WidthContainer,
  Fieldset
} from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';
import RTEFieldset from '@asl/projects/client/components/fieldset';

const commentsSchema = {
  comments: {
    inputType: 'textarea'
  }
};

const FormBody = ({ fields, model, formFields, submit, project }) => {
  const [ values, setValues ] = useState(model);
  return <Fragment>
    <WidthContainer>
      <dl>
        <dt>Current PPL holder</dt>
        <dd>{`${project.licenceHolder.firstName} ${project.licenceHolder.lastName}`}</dd>
      </dl>
      { formFields }
    </WidthContainer>
    <RTEFieldset
      fields={fields}
      values={values}
      altLabels={true}
      noComments={true}
      onFieldChange={(key, value) => setValues({ ...values, [key]: value })}
    />
    {
      Object.keys(values).filter(key => !['licenceHolderId', 'experience-projects', 'comments'].includes(key)).map(key => (
        <input key={key} type="hidden" name={key} value={typeof values[key] === 'string' ? values[key] : JSON.stringify(values[key])} />
      ))
    }
    {
      project.status === 'active' && !project.isLegacyStub && <Fieldset model={values} schema={commentsSchema} />
    }
    <Button>
      <Snippet>buttons.submit</Snippet>
    </Button>
  </Fragment>;
};

const UpdateLicenceHolder = () => {
  const model = useSelector(state => state.model);
  const { fields, project } = useSelector(state => state.static);
  return <Fragment>
    <ErrorSummary />
    <Header
      title={<Snippet>title</Snippet>}
      subtitle={project.title || 'Untitled project'}
    />
    <Form detachFields submit={false}>
      <FormBody
        project={project}
        fields={fields}
        model={model}
      />
    </Form>
  </Fragment>;
};

export default UpdateLicenceHolder;
