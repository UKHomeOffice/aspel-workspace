import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Snippet } from '@asl/components';

class Roles extends React.Component {

  render () {
    const model = this.props.model;

    const available = ['asruAdmin', 'asruLicensing', 'asruInspector'];
    const roles = available.filter(role => model[role]);
    return <Fragment>
      <h3><Snippet>asru.roles.title</Snippet></h3>
      <ul>
        {
          roles.map(role => <li key={ role }><Snippet>{ `asru.roles.${role}` }</Snippet></li>)
        }
      </ul>
    </Fragment>;

  }

}

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(Roles);
