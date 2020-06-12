import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Snippet, ControlBar } from '@asl/components';
import { CheckboxGroup, Button } from '@ukhomeoffice/react-components';

import ASRURoles from '@asl/pages/pages/global-profile/components/asru-roles';

class ManageRoles extends React.Component {

  componentDidMount () {
    this.setState({ expanded: false });
  }

  toggle (e) {
    e.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render () {
    const { model, roles } = this.props;

    if (!model.asruUser) {
      return null;
    }

    const options = roles.map(value => ({ value, label: <Snippet>{ `asru.roles.${value}` }</Snippet> }));
    const userRoles = roles.filter(role => model[role]);

    if (this.state && !this.state.expanded) {
      return <Fragment>
        <ASRURoles />
        <Button onClick={e => this.toggle(e)}><Snippet>asru.roles.manage</Snippet></Button>
      </Fragment>;
    }

    return <Fragment>
      <form action="" method="post">
        <input type="hidden" name="roles" value="" />
        <CheckboxGroup label={ <Snippet>asru.roles.title</Snippet> } name="roles" options={options} value={userRoles} />
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

const mapStateToProps = ({ model, static: { roles } }) => ({ model, roles });

export default connect(mapStateToProps)(ManageRoles);
