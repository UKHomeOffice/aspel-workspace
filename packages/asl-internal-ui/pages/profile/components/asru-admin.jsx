import React, { Fragment } from 'react';

import ManageRoles from './manage-roles';
import ToggleASRU from './toggle-asru';

class ASRUAdmin extends React.Component {

  render () {
    return <Fragment>
      <hr />
      <h2>ASRU</h2>
      <ManageRoles />
      <hr />
      <ToggleASRU />
    </Fragment>
  }

}

export default ASRUAdmin;
