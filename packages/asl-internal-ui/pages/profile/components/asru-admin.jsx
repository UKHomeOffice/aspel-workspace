import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Snippet } from '@asl/components';

import ManageRoles from './manage-roles';
import ToggleASRU from './toggle-asru';
import ASRURoles from './asru-roles';

class ASRUAdmin extends React.Component {

  renderRoles () {
    if (!this.props.canAdmin) {
      return <ASRURoles />;
    }
    return <Fragment>
      <ManageRoles />
      <ToggleASRU />
    </Fragment>;
  }

  render () {

    const model = this.props.model;
    const hasEstablishments = !!model.establishments.length;

    if (hasEstablishments) {
      return null;
    }

    return <Fragment>
      <hr />
      <h2><Snippet>asru.title</Snippet></h2>
      { this.renderRoles() }
    </Fragment>
  }

}


const mapStateToProps = ({ model, static: { canAdmin } }) => ({ model, canAdmin });

export default connect(mapStateToProps)(ASRUAdmin);
