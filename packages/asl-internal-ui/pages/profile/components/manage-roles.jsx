import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Snippet, ControlBar } from '@asl/components';
import { CheckboxGroup, Button } from '@ukhomeoffice/react-components';

import ASRURoles from './asru-roles';

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
    const options = available.map(value => ({ value, label: <Snippet>{ `asru.roles.${value}` }</Snippet> }));
    const roles = available.filter(role => model[role]);

    if (this.state && !this.state.expanded) {
      return <Fragment>
        <ASRURoles />
        <Button onClick={e => this.toggle(e)}><Snippet>asru.roles.manage</Snippet></Button>
      </Fragment>
    }

    return <Fragment>
      <form action="" method="post">
        <CheckboxGroup label={ <Snippet>asru.roles.title</Snippet> } name="roles" options={options} value={roles} className="box" />
        <ControlBar>
          <Button type="submit"><Snippet>asru.roles.save</Snippet></Button>
          {
            this.state && <a href="" onClick={e => this.toggle(e)}><Snippet>asru.roles.cancel</Snippet></a>
          }
        </ControlBar>
      </form>
    </Fragment>;

  }

}

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(ManageRoles);
