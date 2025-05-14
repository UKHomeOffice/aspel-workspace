import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  ControlBar,
  ErrorSummary,
  FormLayout,
  Header,
  Link,
  Snippet
} from '@ukhomeoffice/asl-components';
import { CheckboxGroup, Warning } from '@ukhomeoffice/react-components';
import namedRoles from '../../content/named-roles';
const mandatoryTrainingRequirementsForRoles = require('../mandatory-training/content/mandatory-training-requirements-for-roles');

const Confirm = ({
  establishment,
  profile,
  profileReplaced,
  values,
  children,
  ...props
}) => {
  const editPath = props.action === 'remove' ? 'delete' : 'create';

  return (
    <FormLayout>
      <ErrorSummary />
      <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
      <Header title={<Snippet>declaration</Snippet>}/>
      <h4><Snippet>applyingFor</Snippet></h4>
      <p>{namedRoles[values.type]}</p>

      <h4><Snippet>onBehalfOf</Snippet></h4>
      <p>{`${profile.firstName} ${profile.lastName}`}</p>

      { profileReplaced && props.action !== 'remove' &&
        <Warning>The existing {profileReplaced.type.toUpperCase()} {profileReplaced.firstName} {profileReplaced.lastName} will be removed from the role when this request is approved.</Warning>
      }

      { values.rcvsNumber &&
        <Fragment>
          <h2><Snippet>rcvsNumber</Snippet></h2>
          <p>{values.rcvsNumber}</p>
        </Fragment>
      }

      {mandatoryTrainingRequirementsForRoles[values.type] && (
        <section>
          <h4><Snippet>explanation</Snippet></h4>
          <p>{values.comment}</p>
        </section>
      )}

      {
        props.action === 'remove' && values.type === 'nacwo' &&
          <Warning><Snippet>nacwoWarning</Snippet></Warning>
      }

      <ControlBar>
        <Link page={`role.${editPath}`} label={<Snippet>buttons.edit</Snippet>} />
        <Link page="profile.read" label={<Snippet>buttons.cancel</Snippet>} />
      </ControlBar>

      <div className="govuk-box requirements-box">
        {values.type === 'nacwo' && <Snippet>declarationNACWODesc</Snippet>}
        {values.type === 'nvs' && <Snippet>declarationNVSDesc</Snippet>}
        {!mandatoryTrainingRequirementsForRoles[values.type] && (
          <Snippet>declarationOtherDesc</Snippet>
        )}

        <CheckboxGroup
          name="roles"
          options={[
            { label: 'I agree with all the above statements',
              value: true }]}
          value={true}
        />
      </div>
    </FormLayout>
  );
};

const mapStateToProps = ({
  static: {
    establishment,
    profile,
    profileReplaced,
    values
  }
}) => ({
  establishment,
  profile,
  profileReplaced,
  values
});

export default connect(mapStateToProps)(Confirm);
