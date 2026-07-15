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
  const formatters = {
    declaration: {
      propMappers: {
        label: (_, formatter) => <Snippet {...formatter.renderContext ?? {}}>{values.type === 'pehl' ? 'pehlAgreement' : 'agreement'}</Snippet>,
        error: (error, formatter) => error && <Snippet {...formatter.renderContext ?? {}}>{values.type === 'pehl' ? 'errors.declaration.pehl' : 'errors.declaration.required'}</Snippet>,
        title: () => <Snippet>fields.declaration.title</Snippet>,
        hint: () => <Snippet>declarations.{values.type}</Snippet>
      },
      renderContext: {
        agreementDeterminer: ['nacwo', 'nvs', 'sqp'].includes(values.type) ? 'all' : 'both',
        roleLabel: namedRoles[values.type]
      }
    }
  };

  const { incompleteTraining = {}, mandatoryTraining } = useSelector(state => state.static);

  return (
    <FormLayout formatters={formatters}>
      <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
      <Header title={<Snippet>confirmTitle</Snippet>}/>
      <dl>
        <NamedPersonDetails roleType={values.type} profile={profile} props={props} profileReplaced={profileReplaced} roleDetails={values} showEditLink />
      </dl>

      <dl>
        <DetailsByRole incompleteTraining={incompleteTraining} mandatoryTraining={mandatoryTraining} role={values.type} roleDetails={values} showHeading showEditLink />
      </dl>

      <dl>
        <SkillsAndExperience roleType={values.type} profile={profile} values={values} showHeading showEditLink />
      </dl>
      {
        props.action === 'remove' && values.type === 'nacwo' &&
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
