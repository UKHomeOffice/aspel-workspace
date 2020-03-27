import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  ControlBar,
  FormLayout,
  Header,
  Link,
  Snippet
} from '@asl/components';
import { Warning } from '@ukhomeoffice/react-components';
import namedRoles from '../content/named-roles';

const Confirm = ({
  establishment,
  profile,
  values,
  children,
  ...props
}) => {
  const editPath = props.action === 'remove' ? 'delete' : 'create';

  return (
    <FormLayout>
      <Header title={<Snippet>reviewRoleApplication</Snippet>}/>
      <h2><Snippet>applyingFor</Snippet></h2>
      <p>{namedRoles[values.type]}</p>

      <h2><Snippet>onBehalfOf</Snippet></h2>
      <p>{`${profile.firstName} ${profile.lastName}`}</p>

      { values.rcvsNumber &&
        <Fragment>
          <h2><Snippet>rcvsNumber</Snippet></h2>
          <p>{values.rcvsNumber}</p>
        </Fragment>
      }

      <h2><Snippet>explanation</Snippet></h2>
      <p>{values.comment}</p>

      {
        props.action === 'remove' && values.type === 'nacwo' &&
          <Warning><Snippet>nacwoWarning</Snippet></Warning>
      }

      <ControlBar>
        <Link page={`role.${editPath}`} label={<Snippet>buttons.edit</Snippet>} />
        <Link page="profile.read" label={<Snippet>buttons.cancel</Snippet>} />
      </ControlBar>

    </FormLayout>
  );
};

const mapStateToProps = ({
  static: {
    establishment,
    profile,
    values
  }
}) => ({
  establishment,
  profile,
  values
});

export default connect(mapStateToProps)(Confirm);
