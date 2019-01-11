import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Snippet, ControlBar } from '@asl/components';
import { CheckboxGroup, Button } from '@ukhomeoffice/react-components';

class ManageRoles extends React.Component {

  componentWillMount () {
    this.setState({ expanded: false });
  }

  toggle (e) {
    e.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const model = this.props.model;

    if (!model.asruUser) {
      return null;
    }

    const available = ['asruAdmin', 'asruLicensing', 'asruInspector'];
    const options = available.map(value => ({ value, label: <Snippet>{ `roles.${value}` }</Snippet> }));
    const roles = available.filter(role => model[role]);

    if (this.state && !this.state.expanded) {
      return <Fragment>
        <h3>Roles</h3>
        <ul>
          {
            roles.map(role => <li key={ role }><Snippet>{ `roles.${role}` }</Snippet></li>)
          }
        </ul>
        <Button onClick={e => this.toggle(e)}>Manage roles</Button>
      </Fragment>;
    }

    return <Fragment>
      <form action="" method="post">
        <CheckboxGroup label="Roles" name="roles" options={options} value={roles} className="box" />
        <ControlBar>
          <Button type="submit">Save changes</Button>
          {
            this.state && <a href="" onClick={e => this.toggle(e)}>Cancel</a>
          }
        </ControlBar>
      </form>
    </Fragment>;

  }

}

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(ManageRoles);
