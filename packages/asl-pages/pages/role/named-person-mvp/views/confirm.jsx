import React, { Fragment } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  ControlBar,
  FormLayout,
  Header,
  Link,
  Snippet
} from '@ukhomeoffice/asl-components';
import { Warning } from '@ukhomeoffice/react-components';
import { NamedPersonDetails, DetailsByRole } from '../../../common/components/role-change-summary';

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
        label: (_, formatter) => <Snippet {...formatter.renderContext ?? {}}>agreement</Snippet>,
        title: () => <Snippet>fields.declaration.title</Snippet>,
        hint: () => <Snippet fallback='declarations.default'>declarations.{values.type}</Snippet>
      },
      renderContext: {
        agreementDeterminer: ['nacwo', 'nvs'].includes(values.type) ? 'all' : 'both'
      }
    }
  };

  const { incompleteTraining = {}, mandatoryTraining } = useSelector(state => state.static);

  // Determine the edit path based on action
  const editPath = props.action === 'remove' ? 'delete' : 'create';

  return (
    <FormLayout formatters={formatters}>
      <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
      <Header title={<Snippet>confirmTitle</Snippet>}/>
      <dl>
        <NamedPersonDetails roleType={values.type} profile={profile} props={props} profileReplaced={profileReplaced} />

        <DetailsByRole incompleteTraining={incompleteTraining} mandatoryTraining={mandatoryTraining} role={values.type} roleDetails={values} />
        { mandatoryTraining === 'yes' && (
          <>
            <dt><Snippet>explanation.trainingComplete</Snippet></dt>
          </>
        ) }
      </dl>

      {
        props.action === 'remove' && values.type === 'nacwo' &&
          <Warning><Snippet>nacwoWarning</Snippet></Warning>
      }

      <ControlBar>
        <Link page={`role.namedPersonMvp.${editPath}`} label={<Snippet>buttons.edit</Snippet>} />
        <Link page="profile.read" label={<Snippet>buttons.cancel</Snippet>} />
      </ControlBar>
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
