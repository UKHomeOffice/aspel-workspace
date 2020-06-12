import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Snippet } from '@asl/components';

import ManageRoles from './manage-roles';
import ToggleASRU from './toggle-asru';
import ASRURoles from '@asl/pages/pages/global-profile/components/asru-roles';

class ASRUAdmin extends React.Component {

  renderRoles () {
    console.log('rendering roles')
    if (!this.props.canAdmin) {
      return <ASRURoles />;
    }

    return (
      <Fragment>
        <ManageRoles />
        <ToggleASRU />
      </Fragment>
    );
  }

  render () {

    const { model, canAdmin } = this.props;
    const hasEstablishments = !!(model.establishments || []).length;

    if (hasEstablishments) {
      return null;
    }

    // profile is not an asru user and user cannot make them one
    if (!canAdmin && !model.asruUser) {
      return null;
    }

    return (
      <ul className="panel-list">
        <li>
          <h2><Snippet>asru.title</Snippet></h2>
          { this.renderRoles() }
        </li>
      </ul>
    );

  }

}

const mapStateToProps = ({ model, static: { canAdmin } }) => ({ model, canAdmin });

export default connect(mapStateToProps)(ASRUAdmin);
