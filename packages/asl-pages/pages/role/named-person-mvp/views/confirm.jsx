import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  ControlBar,
  FormLayout,
  Header,
  Link,
  Snippet
} from '@ukhomeoffice/asl-components';
import { Warning } from '@ukhomeoffice/react-components';
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

  return (
    <FormLayout formatters={formatters}>
      <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>
      <Header title={<Snippet>confirmTitle</Snippet>}/>
      <dl>
        <dt><Snippet>applyingFor</Snippet></dt>
        <dd>{namedRoles[values.type]}</dd>

        <dt><Snippet>onBehalfOf</Snippet></dt>
        <dd>
          {`${profile.firstName} ${profile.lastName}`}
          { profileReplaced && props.action !== 'remove' &&
            <Warning>The existing {profileReplaced.type.toUpperCase()} {profileReplaced.firstName} {profileReplaced.lastName} will be removed from the role when this request is approved.</Warning>
          }
        </dd>

        { values.rcvsNumber &&
          <Fragment>
            <dt><Snippet>rcvsNumber</Snippet></dt>
            <dd>{values.rcvsNumber}</dd>
          </Fragment>
        }

        {mandatoryTrainingRequirementsForRoles[values.type] && (
          <Fragment>
            <dt><Snippet>explanation</Snippet></dt>
            <dd>{values.comment}</dd>
          </Fragment>
        )}
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
