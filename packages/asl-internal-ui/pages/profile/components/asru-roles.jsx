import React from 'react';
import { connect } from 'react-redux';
import { Snippet } from '@asl/components';

class Roles extends React.Component {

  render () {
    const { model, roles } = this.props;
    const userRoles = roles.filter(role => model[role]);

    return (
      <div className="asru-roles">
        <h3><Snippet>asru.roles.title</Snippet></h3>
        <ul>
          {
            userRoles.map(role => <li key={ role }><Snippet>{ `asru.roles.${role}` }</Snippet></li>)
          }
        </ul>
      </div>
    );
  }

}

const mapStateToProps = ({ model, static: { roles } }) => ({ model, roles });

export default connect(mapStateToProps)(Roles);
