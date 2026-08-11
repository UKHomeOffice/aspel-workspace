import React from 'react';
import { connect, useSelector } from 'react-redux';
import {
  FormLayout,
  Header,
  Snippet
} from '@ukhomeoffice/asl-components';
import { Warning } from '@ukhomeoffice/react-components';
import { NamedPersonDetails, DetailsByRole, SkillsAndExperience } from '../../../common/components/role-change-summary';
import namedRoles from '../content/named-roles';

const Confirm = ({
  establishment,
  profile,
  profileReplaced,
  values,
  children,
  ...props
}) => {
  const roleType = (values.type || '').toLowerCase();

  const formatters = {
    declaration: {
      propMappers: {
        label: (_, formatter) => <Snippet {...formatter.renderContext ?? {}}>{roleType === 'pelh' ? 'pelhAgreement' : 'agreement'}</Snippet>,
        error: (error, formatter) => error && <Snippet {...formatter.renderContext ?? {}}>{roleType === 'pelh' ? 'errors.declaration.pelh' : 'errors.declaration.required'}</Snippet>,
        title: () => <Snippet>fields.declaration.title</Snippet>,
        hint: () => roleType === 'pelh' ? null : <Snippet>declarations.{roleType}</Snippet>
      },
      renderContext: {
        agreementDeterminer: ['nacwo', 'nvs', 'sqp'].includes(roleType) ? 'all' : 'both',
        roleLabel: namedRoles[roleType]
      }
    }
  };

  const { incompleteTraining = {}, mandatoryTraining } = useSelector(state => state.static);

  return (
    <FormLayout formatters={formatters} renderers={formatters}>
      <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
      <Header title={<Snippet>confirmTitle</Snippet>}/>
      <dl>
        <NamedPersonDetails roleType={roleType} profile={profile} props={props} profileReplaced={profileReplaced} roleDetails={values} showEditLink />
      </dl>

      <dl>
        <DetailsByRole incompleteTraining={incompleteTraining} mandatoryTraining={mandatoryTraining} role={roleType} roleDetails={values} showHeading showEditLink />
      </dl>

      <dl>
        <SkillsAndExperience roleType={roleType} profile={profile} values={values} showHeading showEditLink />
      </dl>
      {
        props.action === 'remove' && roleType === 'nacwo' &&
          <Warning><Snippet>nacwoWarning</Snippet></Warning>
      }

    </FormLayout>
  );
};

const mapStateToProps = ({
  static: {
    establishment,
    profile,
    profileReplaced,
    values,
    ...rest
  }
}) => ({
  establishment,
  profile,
  profileReplaced,
  values,
  rest
});

export default connect(mapStateToProps)(Confirm);
